#!/usr/bin/env bash
# Lighthouse をモバイル設定で実行し、4カテゴリの点数と主要指標を表示する。
# エージェントのクラウドの作業環境で使う。測るのは主要ページだけ（quality-gate.md の「測るページ」）。
# 使い方: bash run_lighthouse.sh URL [URL ...]
# 結果の JSON は ./lighthouse-reports/ に保存する。
set -euo pipefail

if [ "$#" -eq 0 ]; then
  echo "usage: $0 URL [URL ...]" >&2
  exit 1
fi

# Chrome の場所を決める。CHROME_PATH があればそれを使い、なければ Playwright の Chromium を探す。
if [ -z "${CHROME_PATH:-}" ]; then
  CHROME_PATH=$(python3 - <<'PY' 2>/dev/null || true
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    print(p.chromium.executable_path)
PY
)
  export CHROME_PATH
fi
if [ -z "${CHROME_PATH:-}" ]; then
  echo "Chrome が見つかりません。'pip install playwright && playwright install chromium' を実行してください。" >&2
  exit 1
fi

# クラウドの作業環境（Claude Code のクラウドセッション、Cowork）では、外への通信がプロキシを通る。
# - パッケージの取得: 環境によって registry.npmjs.org が NO_PROXY に入っていて名前解決できないため、
#   この実行だけ NO_PROXY を localhost に絞り、プロキシ経由で取りに行く
# - Chrome: HTTPS_PROXY を --proxy-server で渡す。ローカルで配信しているページはプロキシを通さない
CHROME_FLAGS="--headless=new --no-sandbox --disable-gpu"
if [ -n "${HTTPS_PROXY:-}" ]; then
  CHROME_FLAGS="$CHROME_FLAGS --proxy-server=${HTTPS_PROXY} --proxy-bypass-list=localhost;127.0.0.1"
  export NO_PROXY="localhost,127.0.0.1" no_proxy="localhost,127.0.0.1" npm_config_noproxy="localhost,127.0.0.1"
fi

# Lighthouse の版は固定する（前回と点数を比べやすくするため。上げ方は references/versions.md の「同じ値を書いている場所」）
LIGHTHOUSE_VERSION="${LIGHTHOUSE_VERSION:-13.6.0}"
# pnpm があれば pnpm dlx、なければ npx で使う
if command -v pnpm >/dev/null 2>&1; then
  LIGHTHOUSE=(pnpm dlx "lighthouse@${LIGHTHOUSE_VERSION}")
else
  LIGHTHOUSE=(npx --yes "lighthouse@${LIGHTHOUSE_VERSION}")
fi

# 計測するページに届くかを先に確かめる。クラウドの作業環境では、外への通信が許可された行き先に限られ、
# 公開中のサイト（workers.dev や独自ドメイン）は最初は許可されていないことが多い。
for url in "$@"; do
  case "$url" in
    http://localhost*|http://127.0.0.1*) continue ;;
  esac
  code=$(curl -s -o /dev/null -m 20 -w "%{http_code}" "$url" || true)
  if [ "$code" = "000" ] || [ "$code" = "403" ]; then
    host=$(echo "$url" | sed -E 's#https?://([^/]+).*#\1#')
    echo "作業環境から ${host} に届きません（HTTP ${code}）。" >&2
    echo "オーナーに、このホストを作業環境の通信の許可に足してもらってください。設定の場所はチャットとコードで違います（quality-gate.md の「作業環境から本番のサイトに届かないとき」）。" >&2
    exit 2
  fi
done

mkdir -p lighthouse-reports
for url in "$@"; do
  name=$(echo "$url" | sed -E 's#https?://##; s#[^A-Za-z0-9]+#_#g; s#_$##')
  out="lighthouse-reports/${name}.json"
  "${LIGHTHOUSE[@]}" "$url" \
    --quiet \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json --output-path="$out" \
    --chrome-flags="$CHROME_FLAGS" >/dev/null
  node -e '
    const r = require(process.argv[1]);
    const c = r.categories, a = r.audits;
    const s = k => Math.round(c[k].score * 100);
    console.log(`${r.finalDisplayedUrl}`);
    console.log(`  パフォーマンス ${s("performance")} / ユーザー補助 ${s("accessibility")} / おすすめの方法 ${s("best-practices")} / SEO ${s("seo")}`);
    console.log(`  LCP ${a["largest-contentful-paint"].displayValue} / CLS ${a["cumulative-layout-shift"].displayValue} / TBT ${a["total-blocking-time"].displayValue}`);
    // 点数に関係する項目（重みが0より大きいもの）だけを出す。参考の項目まで出すと、直す必要がないものまで並ぶため
    const weighted = new Set(Object.values(c).flatMap(cat => cat.auditRefs.filter(ref => ref.weight > 0).map(ref => ref.id)));
    const fails = Object.values(a).filter(x => weighted.has(x.id) && x.score !== null && x.score < 0.9).slice(0, 8);
    for (const f of fails) console.log(`  - 要改善: ${f.title}`);
  ' "$(pwd)/$out"
done
