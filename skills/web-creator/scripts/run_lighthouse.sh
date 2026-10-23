#!/usr/bin/env bash
# Lighthouse をモバイル設定で実行し、4カテゴリの点数と主要指標を表示する。
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

mkdir -p lighthouse-reports
for url in "$@"; do
  name=$(echo "$url" | sed -E 's#https?://##; s#[^A-Za-z0-9]+#_#g; s#_$##')
  out="lighthouse-reports/${name}.json"
  npx --yes lighthouse "$url" \
    --quiet \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json --output-path="$out" \
    --chrome-flags="--headless=new --no-sandbox --disable-gpu" >/dev/null
  node -e '
    const r = require(process.argv[1]);
    const c = r.categories, a = r.audits;
    const s = k => Math.round(c[k].score * 100);
    console.log(`${r.finalDisplayedUrl}`);
    console.log(`  パフォーマンス ${s("performance")} / ユーザー補助 ${s("accessibility")} / おすすめの方法 ${s("best-practices")} / SEO ${s("seo")}`);
    console.log(`  LCP ${a["largest-contentful-paint"].displayValue} / CLS ${a["cumulative-layout-shift"].displayValue} / TBT ${a["total-blocking-time"].displayValue}`);
    const fails = Object.values(a).filter(x => x.score !== null && x.score < 0.9 && x.scoreDisplayMode !== "informative" && x.scoreDisplayMode !== "manual").slice(0, 8);
    for (const f of fails) console.log(`  - 要改善: ${f.title}`);
  ' "$(pwd)/$out"
done
