#!/usr/bin/env python3
"""スマホの狭い幅（iPhone SE など）で表示が崩れていないかを調べる。

使い方:
  python3 check_mobile_width.py URL [URL ...] [--widths 320 375 390] [--out mobile-shots]

調べること（幅ごと、ページごと）:
  - 横スクロールが出ていないか（ページの幅が画面の幅より広くないか）
  - 画面の右端からはみ出している要素がないか（上位5つを表示）
  - ヘッダーの中で、ロゴやメニューの文字、横に並んだ項目が折り返していないか
  - ヘッダーの高さが、いちばん広い幅のときより大きくなっていないか
  - スクリーンショット（ファーストビュー）を --out に保存する。崩れは最後に目で確かめる

問題が見つかったら終了コード 1 を返す。
必要なもの: Playwright（pip install playwright）と Chromium。
Chromium の場所は CHROME_PATH で指定できる（run_lighthouse.sh と同じ）。
"""
import argparse
import os
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

# 320: iPhone SE（第1世代）や画面の拡大表示、375: iPhone SE（第2・第3世代）、390: 一般的な iPhone
DEFAULT_WIDTHS = [320, 375, 390]
HEADER_GROWTH_PX = 12  # これより高くなったら折り返しを疑う

MEASURE_JS = """
() => {
  const vw = document.documentElement.clientWidth;
  const sw = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  const overflow = [];
  for (const el of document.body.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const st = getComputedStyle(el);
    if (st.position === 'fixed' && r.left >= vw) continue;  // 閉じたメニューなど画面外に置いたもの
    if (r.right > vw + 1) {
      const name = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') +
        (el.classList.length ? '.' + [...el.classList].slice(0, 2).join('.') : '');
      overflow.push({ name, right: Math.round(r.right) });
    }
  }
  const header = document.querySelector('header, [role="banner"]');
  const wraps = [];
  if (header) {
    // 文字の折り返し: リンク、ボタン、ロゴの文字が2行以上になっている
    for (const el of header.querySelectorAll('a, button, h1, p, span, b, strong')) {
      const st = getComputedStyle(el);
      if (st.display === 'none' || st.visibility === 'hidden' || el.children.length > 1) continue;
      const r = el.getBoundingClientRect();
      const lh = parseFloat(st.lineHeight) || parseFloat(st.fontSize) * 1.5;
      if (r.height > lh * 1.6 && el.textContent.trim()) wraps.push('文字「' + el.textContent.trim().slice(0, 12) + '」');
    }
    // 並びの折り返し: 横に並ぶはずの要素が2段以上になっている
    for (const el of [header, ...header.querySelectorAll('*')]) {
      const st = getComputedStyle(el);
      if (!st.display.includes('flex') || st.flexDirection.startsWith('column')) continue;
      const tops = [...el.children].map(c => c.getBoundingClientRect())
        .filter(r => r.width && r.height).map(r => Math.round(r.top));
      if (tops.length > 1 && Math.max(...tops) - Math.min(...tops) > 8) {
        wraps.push('並び ' + el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''));
      }
    }
  }
  return {
    vw, sw, overflow: overflow.slice(0, 5), overflowCount: overflow.length,
    headerHeight: header ? Math.round(header.getBoundingClientRect().height) : null,
    wraps: [...new Set(wraps)].slice(0, 5),
  };
}
"""


def slug(url: str) -> str:
    return re.sub(r"[^A-Za-z0-9]+", "_", url.split("://", 1)[-1]).strip("_")[:60] or "page"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("urls", nargs="+")
    ap.add_argument("--widths", nargs="+", type=int, default=DEFAULT_WIDTHS)
    ap.add_argument("--out", default="mobile-shots")
    args = ap.parse_args()

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    widths = sorted(set(args.widths))
    problems = 0

    with sync_playwright() as p:
        launch = {"executable_path": os.environ["CHROME_PATH"]} if os.environ.get("CHROME_PATH") else {}
        browser = p.chromium.launch(**launch)
        for url in args.urls:
            print(f"\n{url}")
            results = {}
            for w in widths:
                page = browser.new_page(viewport={"width": w, "height": 740}, device_scale_factor=2,
                                        is_mobile=True, has_touch=True)
                page.goto(url, wait_until="networkidle")
                results[w] = page.evaluate(MEASURE_JS)
                page.screenshot(path=str(out / f"{slug(url)}_{w}.png"))
                page.close()

            widest = results[widths[-1]].get("headerHeight")
            for w in widths:
                r = results[w]
                notes = []
                if r["sw"] > r["vw"] + 1:
                    notes.append(f"横スクロールあり（ページの幅 {r['sw']}px）")
                if r["overflowCount"]:
                    names = ", ".join(f"{o['name']}（右端 {o['right']}px）" for o in r["overflow"])
                    notes.append(f"はみ出し {r['overflowCount']} 件: {names}")
                h = r.get("headerHeight")
                if r.get("wraps"):
                    notes.append("ヘッダーの中で折り返し: " + ", ".join(r["wraps"]))
                if h is not None and widest is not None and h > widest + HEADER_GROWTH_PX:
                    notes.append(f"ヘッダーが {widths[-1]}px のときより高い（{widest}px → {h}px）。折り返しを疑う")
                status = "NG" if notes else "OK"
                problems += bool(notes)
                header = f"ヘッダー {h}px" if h is not None else "ヘッダーなし"
                print(f"  {w}px: {status}（{header}）")
                for n in notes:
                    print(f"    - {n}")
        browser.close()

    print(f"\nスクリーンショット: {out}/（各幅のファーストビュー。最後に目で確かめる）")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
