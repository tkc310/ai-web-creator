#!/usr/bin/env python3
"""ビルドしたページを、Claude のアーティファクトとして公開できる1つの HTML（プレビュー）にまとめる。

使い方:
  # ビルド結果のファイルから（Astro の SSG、HTML のサイト）
  python3 make_preview.py dist/news/2026-10-holiday/index.html --root dist --out preview.html \
      --label "お知らせ「年末年始の休業」"

  # 起動中のサーバーから（SSR のページ、EmDash。例: npm run preview や wrangler dev を起動しておく）
  python3 make_preview.py http://localhost:4321/news/2026-10-holiday/ --out preview.html --label "..."

  # 複数のページやデザイン案をタブで切り替えて見せる
  python3 make_preview.py dist/index.html dist/about/index.html --root dist --out preview.html \
      --names "トップ" "会社概要" --label "デザインの変更"

何をするか:
  - CSS、JavaScript、画像、フォントをページの中に埋め込む（アーティファクトは外部のファイルを読めないため）
  - ページは iframe の中に入れ、スマホ幅と PC 幅を切り替えて見られるようにする
  - サイト内のリンクは押しても移動しないようにする（プレビューの中では開けないため）
  - 外部のサイトから読み込むスクリプト（解析タグなど）は外し、外したものを一覧で表示する
"""
import argparse
import base64
import html
import mimetypes
import pathlib
import re
import sys
import urllib.parse
import urllib.request

MAX_BYTES = 15 * 1024 * 1024  # アーティファクトの上限（16MB）より少し小さく

mimetypes.add_type("font/woff2", ".woff2")
mimetypes.add_type("font/woff", ".woff")
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("image/avif", ".avif")
mimetypes.add_type("image/svg+xml", ".svg")


class Loader:
    """ページと、ページが参照するファイルを読み込む。ファイル（--root）と URL の両方に対応する。"""

    def __init__(self, root: pathlib.Path | None):
        self.root = root
        self.removed: list[str] = []

    def is_url(self, ref: str) -> bool:
        return ref.startswith("http://") or ref.startswith("https://")

    def resolve(self, base: str, ref: str) -> str | None:
        ref = ref.strip()
        if not ref or ref.startswith(("data:", "#", "mailto:", "tel:", "javascript:")):
            return None
        if self.is_url(base) or self.is_url(ref) or ref.startswith("//"):
            full = urllib.parse.urljoin(base, ref)
            # 外部のホストは読み込まない（ページと同じホストのものだけ埋め込む）
            if self.is_url(base) and urllib.parse.urlparse(full).netloc != urllib.parse.urlparse(base).netloc:
                return None
            if not self.is_url(base):
                return None
            return full.split("#")[0]
        ref = ref.split("?")[0].split("#")[0]
        if ref.startswith("/"):
            if not self.root:
                return None
            return str(self.root / ref.lstrip("/"))
        return str((pathlib.Path(base).parent / ref).resolve())

    def read(self, ref: str) -> bytes | None:
        try:
            if self.is_url(ref):
                with urllib.request.urlopen(ref, timeout=20) as r:
                    return r.read()
            p = pathlib.Path(ref)
            if p.is_dir():
                p = p / "index.html"
            return p.read_bytes()
        except Exception:
            return None

    def data_uri(self, base: str, ref: str) -> str | None:
        full = self.resolve(base, ref)
        if not full:
            return None
        data = self.read(full)
        if data is None:
            return None
        mime = mimetypes.guess_type(full.split("?")[0])[0] or "application/octet-stream"
        return f"data:{mime};base64," + base64.b64encode(data).decode()


def inline_css(css: str, css_ref: str, loader: Loader) -> str:
    def repl(m):
        ref = m.group(2)
        uri = loader.data_uri(css_ref, ref)
        return f"url({uri})" if uri else m.group(0)

    css = re.sub(r"url\((['\"]?)([^'\")]+)\1\)", repl, css)
    # @import は読み込めないので外す
    return re.sub(r"@import[^;]+;", "", css)


def bundle_page(src: str, loader: Loader) -> tuple[str, str]:
    raw = loader.read(src)
    if raw is None:
        sys.exit(f"ページを読み込めません: {src}")
    doc = raw.decode("utf-8", errors="replace")
    title_m = re.search(r"<title>(.*?)</title>", doc, re.S | re.I)
    title = html.unescape(title_m.group(1).strip()) if title_m else "プレビュー"

    # CSS ファイルを <style> に置き換える
    def link_repl(m):
        tag = m.group(0)
        if not re.search(r"rel=['\"]?stylesheet", tag, re.I):
            # アイコンや preload などは外す
            return "" if re.search(r"rel=['\"]?(preload|modulepreload|prefetch|icon|manifest|apple-touch-icon)", tag, re.I) else tag
        href = re.search(r"href=['\"]([^'\"]+)['\"]", tag)
        if not href:
            return tag
        if href.group(1).startswith("https://fonts.googleapis.com"):
            return tag  # Google Fonts はアーティファクトで読み込める
        full = loader.resolve(src, href.group(1))
        data = loader.read(full) if full else None
        if data is None:
            loader.removed.append(href.group(1))
            return ""
        return "<style>" + inline_css(data.decode("utf-8", errors="replace"), full, loader) + "</style>"

    doc = re.sub(r"<link\b[^>]*>", link_repl, doc, flags=re.I)

    # <style> の中の url() を埋め込む
    doc = re.sub(r"(<style\b[^>]*>)(.*?)(</style>)",
                 lambda m: m.group(1) + inline_css(m.group(2), src, loader) + m.group(3), doc, flags=re.S | re.I)

    # スクリプト: 同じサイトのものは埋め込み、外部のものは外す
    def script_repl(m):
        attrs, body = m.group(1), m.group(2)
        s = re.search(r"src=['\"]([^'\"]+)['\"]", attrs)
        if not s:
            return m.group(0)
        full = loader.resolve(src, s.group(1))
        data = loader.read(full) if full else None
        if data is None:
            loader.removed.append(s.group(1))
            return ""
        attrs = re.sub(r"\s*src=['\"][^'\"]+['\"]", "", attrs)
        return f"<script{attrs}>{data.decode('utf-8', errors='replace')}</script>"

    doc = re.sub(r"<script\b([^>]*)>(.*?)</script>", script_repl, doc, flags=re.S | re.I)

    # 画像: src、srcset、poster、style の url()
    def attr_repl(m):
        name, q, val = m.group(1), m.group(2), m.group(3)
        if name.lower() == "srcset":
            parts = []
            for item in val.split(","):
                bits = item.strip().split()
                if not bits:
                    continue
                uri = loader.data_uri(src, bits[0])
                parts.append(" ".join([uri or bits[0]] + bits[1:]))
            return f'{name}={q}{", ".join(parts)}{q}'
        uri = loader.data_uri(src, val)
        return f"{name}={q}{uri}{q}" if uri else m.group(0)

    doc = re.sub(r"\b(src|srcset|poster)=(['\"])(.*?)\2", attr_repl, doc, flags=re.I)
    doc = re.sub(r"style=(['\"])(.*?)\1",
                 lambda m: f"style={m.group(1)}{inline_css(m.group(2), src, loader)}{m.group(1)}", doc, flags=re.S | re.I)

    # サイト内のリンクは移動しないようにする（<a> だけが対象）
    def a_repl(m):
        pre, q, href = m.group(1), m.group(2), m.group(3)
        if not href or href.startswith(("#", "mailto:", "tel:")):
            return m.group(0)
        if href.startswith(("http://", "https://")):
            same = loader.is_url(src) and urllib.parse.urlparse(href).netloc == urllib.parse.urlparse(src).netloc
            if not same:
                return f'{pre}href={q}{href}{q} target="_blank" rel="noopener"'
        return f'{pre}href={q}#{q} data-preview-href={q}{href}{q}'

    doc = re.sub(r"(<a\b[^>]*?)href=(['\"])([^'\"]*)\2", a_repl, doc, flags=re.I)
    return title, doc


OUTER = """<title>{page_title}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
/* プレビューの外枠。中のページは iframe に入れて、サイトのデザインをそのまま見せる */
:root {{ --bg: #f3f2ef; --fg: #1f2429; --sub: #5f686f; --line: #dcd9d3; --chip: #ffffff; --accent: #1f2429; --accent-fg: #ffffff; --note: #fff4d6; --note-fg: #6b4e00; }}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg: #17191b; --fg: #e8eaeb; --sub: #a3abb1; --line: #2e3337; --chip: #222629; --accent: #e8eaeb; --accent-fg: #17191b; --note: #3a2f12; --note-fg: #f3d58a; color-scheme: dark; }} }}
:root[data-theme="dark"] {{ --bg: #17191b; --fg: #e8eaeb; --sub: #a3abb1; --line: #2e3337; --chip: #222629; --accent: #e8eaeb; --accent-fg: #17191b; --note: #3a2f12; --note-fg: #f3d58a; color-scheme: dark; }}
* {{ box-sizing: border-box; }}
body {{ background: var(--bg); color: var(--fg); font-family: "Hiragino Sans", "Noto Sans JP", system-ui, sans-serif; line-height: 1.6; }}
body::before {{ content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 10; background: var(--bg); }}
.bar {{ position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5; background: var(--bg); border-bottom: 1px solid var(--line);
  padding-block: 12px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }}
.bar-in {{ max-width: 1280px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 10px 16px; align-items: center; justify-content: space-between; }}
.tag {{ display: inline-block; font-size: 12px; font-weight: 700; letter-spacing: .04em; padding: 3px 10px; border-radius: 999px; background: var(--note); color: var(--note-fg); }}
.label {{ font-weight: 700; font-size: 15px; margin-left: 8px; }}
.seg {{ display: inline-flex; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: var(--chip); }}
.seg button {{ font: inherit; font-size: 13px; padding: 6px 12px; border: 0; background: transparent; color: var(--sub); cursor: pointer; }}
.seg button[aria-pressed="true"] {{ background: var(--accent); color: var(--accent-fg); }}
.seg button:focus-visible {{ outline: 2px solid var(--fg); outline-offset: 2px; }}
.controls {{ display: flex; flex-wrap: wrap; gap: 8px; }}
.stage {{ padding-block: 20px 48px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }}
.frame {{ display: block; margin: 0 auto; width: 100%; max-width: 1280px; border: 1px solid var(--line); border-radius: 10px; background: #fff; transition: max-width .2s ease; }}
body.sp .frame {{ max-width: 390px; }}
.notes {{ max-width: 1280px; margin: 12px auto 0; font-size: 13px; color: var(--sub); }}
@media (prefers-reduced-motion: reduce) {{ .frame {{ transition: none; }} }}
</style>
<div class="bar">
  <div class="bar-in">
    <div><span class="tag">公開前のプレビュー</span><span class="label">{label}</span></div>
    <div class="controls">
      {tabs}
      <div class="seg" role="group" aria-label="表示幅">
        <button type="button" id="w-sp" aria-pressed="true">スマホ</button>
        <button type="button" id="w-pc" aria-pressed="false">PC</button>
      </div>
    </div>
  </div>
</div>
<div class="stage">
  <iframe class="frame" id="frame" title="ページのプレビュー"></iframe>
  <p class="notes">{notes}</p>
</div>
<script>
(function () {{
  var pages = {pages_json};
  var frame = document.getElementById('frame');
  function fit() {{
    try {{ var d = frame.contentDocument; frame.style.height = Math.max(600, d.documentElement.scrollHeight) + 'px'; }} catch (e) {{ frame.style.height = '1600px'; }}
  }}
  function show(i) {{
    frame.srcdoc = pages[i];
    document.querySelectorAll('[data-page]').forEach(function (b) {{ b.setAttribute('aria-pressed', String(Number(b.dataset.page) === i)); }});
  }}
  frame.addEventListener('load', function () {{
    fit(); setTimeout(fit, 400); setTimeout(fit, 1500);
    try {{
      frame.contentDocument.addEventListener('click', function (e) {{
        var a = e.target.closest && e.target.closest('a[data-preview-href]');
        if (a) e.preventDefault();
      }});
    }} catch (e) {{}}
  }});
  document.querySelectorAll('[data-page]').forEach(function (b) {{ b.addEventListener('click', function () {{ show(Number(b.dataset.page)); }}); }});
  function width(sp) {{
    document.body.classList.toggle('sp', sp);
    document.getElementById('w-sp').setAttribute('aria-pressed', String(sp));
    document.getElementById('w-pc').setAttribute('aria-pressed', String(!sp));
    setTimeout(fit, 250);
  }}
  document.getElementById('w-sp').addEventListener('click', function () {{ width(true); }});
  document.getElementById('w-pc').addEventListener('click', function () {{ width(false); }});
  document.body.classList.add('sp');
  show(0);
}})();
</script>
"""


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("sources", nargs="+", help="ページのファイルか URL（複数可）")
    ap.add_argument("--root", help="ビルド結果のフォルダ（dist など）。/ で始まるパスの基準")
    ap.add_argument("--out", default="preview.html")
    ap.add_argument("--label", default="", help="プレビューの見出し（例: お知らせ「年末年始の休業」）")
    ap.add_argument("--names", nargs="*", help="複数ページのときのタブの名前")
    ap.add_argument("--standalone", action="store_true", help="ブラウザで直接開ける完全な HTML にする（アーティファクトを使わない場合）")
    args = ap.parse_args()

    loader = Loader(pathlib.Path(args.root).resolve() if args.root else None)
    pages, titles = [], []
    for src in args.sources:
        title, doc = bundle_page(src, loader)
        pages.append(doc)
        titles.append(title)

    import json
    names = args.names or titles
    tabs = ""
    if len(pages) > 1:
        tabs = '<div class="seg" role="group" aria-label="ページ">' + "".join(
            f'<button type="button" data-page="{i}" aria-pressed="{str(i == 0).lower()}">{html.escape(n)}</button>'
            for i, n in enumerate(names)) + "</div>"
    notes = "サイト内のリンクは、プレビューの中では移動しません。"
    if loader.removed:
        uniq = sorted(set(loader.removed))
        notes += " 読み込まなかったもの: " + "、".join(html.escape(u) for u in uniq[:8])
    label = html.escape(args.label or titles[0])
    out = OUTER.format(
        page_title=html.escape(("プレビュー " + (args.label or titles[0]))[:40]),
        label=label, tabs=tabs, notes=notes,
        pages_json=json.dumps(pages, ensure_ascii=False).replace("</", "<\\/"),
    )
    if args.standalone:
        out = '<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0">' + out + "</body></html>"
    data = out.encode("utf-8")
    if len(data) > MAX_BYTES:
        sys.exit(f"プレビューが大きすぎます（{len(data) / 1024 / 1024:.1f}MB）。画像を縮小するか、ページを分けてください")
    pathlib.Path(args.out).write_bytes(data)
    print(f"wrote {args.out} ({len(data) / 1024:.0f} KB, {len(pages)} page(s))")
    if loader.removed:
        print("読み込まなかったもの:", ", ".join(sorted(set(loader.removed))))


if __name__ == "__main__":
    main()
