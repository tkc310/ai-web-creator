#!/usr/bin/env bash
# 公開後の確認（スモークテスト）。deploy.yml の smoke のジョブと、autofix.yml の「公開後の確認」が動かす。
# サイトのリポジトリの .github/scripts/smoke.sh に置く（元は skills/web-creator/templates/github/scripts/smoke.sh）。
#
# 確かめるページは .github/smoke-test.txt に書く。1行に1つ、次の形で、空白で区切る。# で始まる行は読まない
#   URL [期待する状態] [そのページに必ず含まれる文字]
#   - 期待する状態は省ける（省くと 200）。3桁の数字だけのときに状態として読む（例: https://example.co.jp/api/contact 405）
#   - 200 のときは、転送（301 など）をたどってから確かめる。200 以外を書いたときは、転送をたどらずにその応答を確かめる
#   - 文字には空白を含めてよい。文字はページの HTML の中で探す（& は &amp; と書くか、記号を含まない言葉を選ぶ）
#   - <...> が残っている行（ひな形のまま）は確かめずに飛ばし、警告を出す
# 確かめたページが0件のときは、初めての公開なら警告だけ、2回目以降（前に成功した deploy がある）なら失敗にする。
# Cloudflare のセキュリティの確認（応答のヘッダーに cf-mitigated: challenge）で止められたページは、失敗にせず警告にする
# （サイトは動いていて、GitHub Actions からの自動のアクセスが確認の画面で止められているだけのことが多いため）。
#
# 待ち方: 1ページにつき10秒おきに5回まで試す。つながらない（状態 000）か 5xx（証明書の発行を待っている間の 525 や 526 など）の
# ときは、独自ドメインにつないだ直後の可能性があるので、そのページの最初の試行から SMOKE_WAIT_SECONDS 秒まで試し続ける
# （すべてのページで待つ長さの合計は、最初の確認から SMOKE_TOTAL_WAIT_SECONDS 秒まで）。
#
# 使う環境変数: SMOKE_WAIT_SECONDS（既定 480）、SMOKE_TOTAL_WAIT_SECONDS（既定 720）、GH_TOKEN と GITHUB_REPOSITORY
# （前に成功した deploy があるかを読むため。読めなければ初めての公開として扱う）
set -u

list="${1:-.github/smoke-test.txt}"
wait_seconds="${SMOKE_WAIT_SECONDS:-480}"
total_seconds="${SMOKE_TOTAL_WAIT_SECONDS:-720}"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

prev_ok=0
if [ -n "${GITHUB_REPOSITORY:-}" ]; then
  prev_ok=$(gh api "repos/${GITHUB_REPOSITORY}/actions/workflows/deploy.yml/runs?status=success&per_page=1" --jq '.total_count' 2>/dev/null || echo 0)
fi
case "$prev_ok" in ''|*[!0-9]*) prev_ok=0 ;; esac

failed=0
checked=0
challenged=0
job_start=$(date +%s)
if [ -f "$list" ]; then
  while IFS= read -r line || [ -n "$line" ]; do
    line="${line%$'\r'}"
    case "$line" in ''|'#'*) continue ;; esac
    case "$line" in
      *'<'*'>'*)
        echo "::warning::ひな形の <...> が残っている行を飛ばしました: ${line}"
        continue ;;
    esac
    url="${line%%[[:space:]]*}"
    rest="${line#"$url"}"
    rest="${rest#"${rest%%[![:space:]]*}"}"
    want=200
    first="${rest%%[[:space:]]*}"
    case "$first" in
      [1-5][0-9][0-9])
        want="$first"
        rest="${rest#"$first"}"
        rest="${rest#"${rest%%[![:space:]]*}"}" ;;
    esac
    expect="$rest"
    follow=()
    [ "$want" = 200 ] && follow=(-L)
    ok=0
    challenge=0
    tries=0
    start=$(date +%s)
    while :; do
      tries=$((tries + 1))
      status=$(curl -sS "${follow[@]}" -D "$work/headers.txt" -o "$work/page.html" -w '%{http_code}' --max-time 15 "$url" 2>/dev/null) || status=000
      if grep -qiE '^cf-mitigated:[[:space:]]*challenge' "$work/headers.txt" 2>/dev/null; then
        challenge=1
        break
      fi
      if [ "$status" = "$want" ] && { [ -z "$expect" ] || grep -qF -- "$expect" "$work/page.html"; }; then
        ok=1
        break
      fi
      now=$(date +%s)
      case "$status" in
        000|5??)
          # 5xx を期待している行では待たない
          [ "$status" = "$want" ] && [ "$tries" -ge 5 ] && break
          # そのページで待つ長さと、すべてのページで待つ長さの合計の、どちらかに達したら終える
          { [ $((now - start)) -ge "$wait_seconds" ] || [ $((now - job_start)) -ge "$total_seconds" ]; } && break ;;
        *) [ "$tries" -ge 5 ] && break ;;
      esac
      sleep 10
    done
    rm -f "$work/headers.txt" "$work/page.html"
    checked=$((checked + 1))
    if [ "$challenge" = 1 ]; then
      challenged=$((challenged + 1))
      echo "::warning::確認できず  $url（Cloudflare のセキュリティの確認の画面が返りました。サイトは動いている可能性が高いので失敗にはしません。ブラウザで開けるかを確かめてください）"
    elif [ "$ok" = 1 ]; then
      echo "OK  $url（状態 ${status}）"
    else
      echo "::error::NG  $url（状態 ${status}。期待した状態は ${want}${expect:+。「${expect}」を含むことを確かめられませんでした}）"
      failed=1
    fi
  done < "$list"
else
  echo "::warning::$list がありません"
fi
if [ "$checked" -gt 0 ] && [ "$challenged" = "$checked" ]; then
  echo "::warning::すべてのページが Cloudflare のセキュリティの確認で止められ、公開後の確認が働いていません。Cloudflare のダッシュボードの Security の設定（Bot Fight Mode など）で、GitHub Actions からのアクセスが止められていないかを確かめてください"
fi
if [ "$checked" = 0 ]; then
  if [ "$prev_ok" -gt 0 ]; then
    # 2回目以降の公開で確かめたページが0件のときは、確認が働いていないので失敗にする
    echo "::error::確かめたページがありません。$list に、公開先の URL とページの文字を書いてください（<...> の行は飛ばされます）"
    failed=1
  else
    echo "::warning::確かめたページがありません。初めての公開なので失敗にはしませんが、次の公開までに $list の <...> を、公開先の URL とページの文字に書き換えてください"
  fi
fi
exit "$failed"
