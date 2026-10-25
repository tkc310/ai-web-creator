#!/usr/bin/env python3
"""チャットなどで受け取った画像を、サイトに載せる前に最適化する。

使い方:
  python3 optimize_images.py 写真1.jpg 写真2.png --out public/images/news/2026-10-holiday \
      --name holiday --widths 800 1600 --alt "店舗の外観" "年末年始のお知らせ"

すること:
  1. 写真の向き（EXIF の回転情報）を画素に反映してから、EXIF・GPS（撮影場所）・XMP などのメタ情報をすべて削除する
  2. 色を sRGB にそろえる（ICC プロファイルは削除する）
  3. 横幅を指定のサイズ以下に縮小する（元より大きくはしない）
  4. AVIF と WebP に変換して圧縮する（AVIF を優先し、対応しないブラウザには WebP を出す）
     処理の負担が大きい場合は変換を省き、元の形式（JPEG / PNG）のまま圧縮する（--mode を参照）
  5. 1枚目から、記事のアイキャッチと OG 画像用の 1200×630 の WebP を作る（--og を付けた場合）
  6. 変換後の大きさと、<picture> の HTML の例を表示する

--mode:
  auto（既定）: 変換する。ただし、画像が20枚を超える場合、変換の合計時間が --budget 秒（既定 60）を超えた場合、
                1枚の変換が8秒を超えた場合は、それ以降を original に切り替える
  convert     : 必ず AVIF と WebP に変換する
  original    : 変換せず、元の形式で圧縮する（JPEG は品質82のプログレッシブ、透過のある画像は PNG）
  clean       : メタ情報の削除だけを行い、--widths の最大の幅を上限に1枚だけ元の形式で書き出す（JPEG は品質90）。
                複数サイズへの縮小と AVIF・WebP への変換は行わない。Astro の astro:assets（<Image> / <Picture>、
                Markdown の ![]()）がビルド時に同じ処理をするサイトで使う
メタ情報の削除と縮小（clean では上限の幅までの縮小）は、どのモードでも必ず行う。

必要なもの: Pillow（AVIF に対応したもの。11.2 以降が目安）。iPhone の HEIC を読むには pillow-heif。
"""
import argparse
import html
import io
import pathlib
import sys
import time

from PIL import Image, ImageCms, ImageOps, features

try:  # iPhone の HEIC/HEIF
    import pillow_heif  # type: ignore

    pillow_heif.register_heif_opener()
    HEIF = True
except Exception:
    HEIF = False

AVIF_QUALITY = 55   # 写真で見た目の劣化が分かりにくい目安
WEBP_QUALITY = 78
MAX_PIXELS = 60_000_000


def to_srgb(im: Image.Image) -> Image.Image:
    icc = im.info.get("icc_profile")
    if icc:
        try:
            src = ImageCms.ImageCmsProfile(io.BytesIO(icc))
            dst = ImageCms.createProfile("sRGB")
            mode = "RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB"
            im = ImageCms.profileToProfile(im.convert(mode), src, dst, outputMode=mode)
        except Exception:
            pass
    return im


def clean(im: Image.Image) -> Image.Image:
    """向きを反映し、メタ情報を持たない新しい画像にする。"""
    im = ImageOps.exif_transpose(im)
    im = to_srgb(im)
    has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
    im = im.convert("RGBA" if has_alpha else "RGB")
    fresh = Image.new(im.mode, im.size)
    fresh.paste(im)
    return fresh  # info（exif、icc_profile、xmp など）を引き継がない


def save(im: Image.Image, path: pathlib.Path, fmt: str, jpeg_quality: int = 82) -> int:
    if fmt == "JPEG":
        im.convert("RGB").save(path, "JPEG", quality=jpeg_quality, optimize=True, progressive=True)
    elif fmt == "PNG":
        im.save(path, "PNG", optimize=True)
    elif fmt == "AVIF":
        im.save(path, "AVIF", quality=AVIF_QUALITY, speed=6)
    else:
        im.save(path, "WEBP", quality=WEBP_QUALITY, method=6)
    return path.stat().st_size


def resize(im: Image.Image, width: int) -> Image.Image:
    if im.width <= width:
        return im
    h = round(im.height * width / im.width)
    return im.resize((width, h), Image.Resampling.LANCZOS)


def og_crop(im: Image.Image) -> Image.Image:
    return ImageOps.fit(im.convert("RGB"), (1200, 630), Image.Resampling.LANCZOS, centering=(0.5, 0.45))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("images", nargs="+")
    ap.add_argument("--out", required=True, help="書き出すフォルダ（例: public/images/news/<slug>）")
    ap.add_argument("--name", required=True, help="ファイル名の元になる英数字（例: holiday）")
    ap.add_argument("--widths", nargs="+", type=int, default=[800, 1600])
    ap.add_argument("--alt", nargs="*", default=[], help="画像ごとの説明（alt）。HTML の例に使う")
    ap.add_argument("--og", action="store_true", help="1枚目から OG 画像（1200×630）を作る")
    ap.add_argument("--mode", choices=["auto", "convert", "original", "clean"], default="auto")
    ap.add_argument("--budget", type=float, default=60, help="auto のとき、変換にかけてよい合計秒数")
    args = ap.parse_args()

    if not features.check("avif"):
        print("注意: この環境の Pillow は AVIF に対応していないため、WebP だけを作ります", file=sys.stderr)
    out = pathlib.Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    Image.MAX_IMAGE_PIXELS = MAX_PIXELS

    mode = args.mode
    if mode == "auto" and len(args.images) > 20:
        mode = "original"
        print("画像が20枚を超えるため、WebP・AVIF への変換は省きます", file=sys.stderr)
    spent = 0.0

    for i, src in enumerate(args.images, 1):
        if mode == "auto" and spent > args.budget:
            mode = "original"
            print(f"変換の時間が {args.budget:.0f} 秒を超えたため、残りは変換を省きます", file=sys.stderr)
        p = pathlib.Path(src)
        if p.suffix.lower() in (".heic", ".heif") and not HEIF:
            sys.exit(f"{p.name}: HEIC を読むには pillow-heif が必要です（pip install pillow-heif）")
        before = p.stat().st_size
        with Image.open(p) as raw:
            raw.load()
            im = clean(raw)
        base = f"{args.name}-{i}"
        made = []
        t0 = time.time()
        if mode == "clean":
            # 縮小と変換は astro:assets に任せ、元にする1枚だけを書き出す
            fmt, ext = ("PNG", "png") if im.mode == "RGBA" else ("JPEG", "jpg")
            r = resize(im, max(args.widths))
            dst = out / f"{base}.{ext}"
            made.append((dst, r.width, r.height, save(r, dst, fmt, jpeg_quality=90)))
            formats = []
        elif mode == "original":
            formats = [("PNG", "png")] if im.mode == "RGBA" else [("JPEG", "jpg")]
        else:
            formats = [(f, e) for f, e in (("AVIF", "avif"), ("WEBP", "webp")) if f != "AVIF" or features.check("avif")]
        for w in sorted(set(args.widths)):
            r = resize(im, w)
            for fmt, ext in formats:
                dst = out / f"{base}-{r.width}.{ext}"
                size = save(r, dst, fmt)
                made.append((dst, r.width, r.height, size))
        took = time.time() - t0
        if mode in ("auto", "convert"):
            spent += took
            if mode == "auto" and took > 8:
                mode = "original"
                print(f"{p.name} の変換に {took:.1f} 秒かかったため、残りは変換を省きます", file=sys.stderr)
        if i == 1 and args.og:
            if mode in ("original", "clean"):
                dst = out / f"{args.name}-og.jpg"
                og_crop(im).save(dst, "JPEG", quality=82, optimize=True, progressive=True)
            else:
                dst = out / f"{args.name}-og.webp"
                og_crop(im).save(dst, "WEBP", quality=WEBP_QUALITY, method=6)
            made.append((dst, 1200, 630, dst.stat().st_size))

        print(f"\n{p.name}: 元 {before / 1024:.0f}KB（{im.width}×{im.height}）、メタ情報を削除")
        for dst, w, h, size in made:
            print(f"  {dst}  {w}×{h}  {size / 1024:.0f}KB")

        # <picture> の例（最大幅の画像の縦横比を width/height に入れる）
        alt = html.escape(args.alt[i - 1] if i - 1 < len(args.alt) else "")
        if mode == "clean":
            src_img = next(d for d, w, h, s in made if "-og" not in d.name)
            print(f'  Markdown: ![{alt}](./{src_img.name})')
            print(f'  .astro  : import photo{i} from "<このファイルからの相対パス>/{src_img.name}";')
            print(f'            <Picture src={{photo{i}}} formats={{["avif", "webp"]}} '
                  f'widths={{[{", ".join(str(w) for w in sorted(set(args.widths)))}]}} sizes="(max-width: 800px) 100vw, 800px" alt="{alt}" />')
            continue
        rel = lambda d: "/" + str(d).split("public/", 1)[-1] if "public/" in str(d) else str(d)
        avifs = [(d, w) for d, w, h, s in made if d.suffix == ".avif"]
        webps = [(d, w, h) for d, w, h, s in made if d.suffix == ".webp" and "-og" not in d.name]
        origs = [(d, w, h) for d, w, h, s in made if d.suffix in (".jpg", ".png") and "-og" not in d.name]
        if origs:
            largest = origs[-1]
            print(f'  <img src="{rel(largest[0])}" srcset="{", ".join(f"{rel(d)} {w}w" for d, w, h in origs)}" '
                  f'sizes="(max-width: 800px) 100vw, 800px" alt="{alt}" width="{largest[1]}" height="{largest[2]}" '
                  'loading="lazy" decoding="async">')
            continue
        largest = webps[-1]
        sizes = '(max-width: 800px) 100vw, 800px'
        lines = ["<picture>"]
        if avifs:
            lines.append(f'  <source type="image/avif" srcset="{", ".join(f"{rel(d)} {w}w" for d, w in avifs)}" sizes="{sizes}">')
        lines.append(f'  <source type="image/webp" srcset="{", ".join(f"{rel(d)} {w}w" for d, w, h in webps)}" sizes="{sizes}">')
        lines.append(f'  <img src="{rel(largest[0])}" alt="{alt}" width="{largest[1]}" height="{largest[2]}" loading="lazy" decoding="async">')
        lines.append("</picture>")
        print("\n".join("  " + l for l in lines))


if __name__ == "__main__":
    main()
