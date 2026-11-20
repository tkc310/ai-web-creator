#!/usr/bin/env bash
# 参照しているスキル（references/external-skills.txt）を、決めたコミットで取得して、写し先の skills/ に置く。
# 使い方: bash skills/web-creator/scripts/fetch_external_skills.sh <写し先の skills フォルダ> [<一覧のファイル>]
# - すでに同じコミットのものが置いてあれば（zip で取り込んだときなど）、取りに行かない
# - 取得したコミットが一覧と違えば、置かずに止まる（終了コード1）
# - 取りに行けなければ、置かずに止まる（終了コード2）。そのスキルを使わずに進める（build.md）
set -euo pipefail
dest="${1:?写し先の skills フォルダを指定してください}"
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
list="${2:-$here/../references/external-skills.txt}"
[ -d "$dest" ] || { echo "写し先がありません: $dest"; exit 1; }
status=0
while read -r name url tag commit _; do
  case "$name" in ''|'#'*) continue ;; esac
  case "$name" in *[!a-z0-9-]*) echo "名前に使えない文字があります: $name"; exit 1 ;; esac
  case "$url" in https://github.com/*/*) ;; *) echo "GitHub の URL ではありません: $url"; exit 1 ;; esac
  case "$url" in *[!A-Za-z0-9._/:-]*) echo "URL に使えない文字があります: $url"; exit 1 ;; esac
  [[ "$commit" =~ ^[0-9a-f]{40}$ ]] || { echo "コミットが40文字の16進数ではありません: $name"; exit 1; }
  if [ -f "$dest/$name/SOURCE" ] && grep -qx "commit: $commit" "$dest/$name/SOURCE"; then
    echo "$name: 同じ版（${commit:0:7}）が置いてあります"
    continue
  fi
  tmp="$(mktemp -d)"
  git -c init.defaultBranch=main init --quiet "$tmp/repo"
  if [ "$tag" != none ]; then ref="refs/tags/$tag"; else ref="$commit"; fi
  if ! git -C "$tmp/repo" fetch --quiet --depth 1 "$url" "$ref"; then
    echo "$name: ${url} から取得できませんでした。このスキルを置かずに進めます"
    rm -rf "$tmp"; status=2; continue
  fi
  got="$(git -C "$tmp/repo" rev-parse 'FETCH_HEAD^{commit}')"
  [ "$got" = "$commit" ] || { echo "$name: 取得したコミット（$got）が一覧（$commit）と違います。置きません"; rm -rf "$tmp"; exit 1; }
  git -C "$tmp/repo" -c advice.detachedHead=false checkout --quiet FETCH_HEAD
  test -f "$tmp/repo/skills/$name/SKILL.md" || { echo "$name: skills/$name/SKILL.md がありません。置きません"; rm -rf "$tmp"; exit 1; }
  rm -rf "${dest:?}/$name"
  cp -R "$tmp/repo/skills/$name" "$dest/$name"
  # スキルが読むデータを、スキルの隣に置く（design-nexus の design-trends。配布元の scripts/build.mjs と同じ置き方）
  if [ -f "$tmp/repo/docs/design-trends/latest.md" ]; then
    cp -R "$tmp/repo/docs/design-trends" "$dest/$name/design-trends"
  fi
  printf 'source: %s\ntag: %s\ncommit: %s\n' "$url" "$tag" "$commit" > "$dest/$name/SOURCE"
  rm -rf "$tmp"
  echo "$name: ${commit:0:7} を置きました"
done < "$list"
exit "$status"
