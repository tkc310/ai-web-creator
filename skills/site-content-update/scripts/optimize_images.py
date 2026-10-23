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
  5. 1枚目から、記事のアイキャッチと OG 画像用の 1200×630 の WebP を作る（--og を付けた場合）
  6. 変換後の大きさと、<picture> の HTML の例を表示する

必要なもの: Pillow（AVIF に対応したもの。11.2 以降が目安）。iPhone の HEIC を読むには pillow-heif。
"""
import argparse
import html
import io
import pathlib
import sys

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


def save(im: Image.Image, path: pathlib.Path, fmt: str) -> int:
    if fmt == "AVIF":
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
    args = ap.parse_args()

    if not features.check("avif"):
        print("注意: この環境の Pillow は AVIF に対応していないため、WebP だけを作ります", file=sys.stderr)
    out = pathlib.Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    Image.MAX_IMAGE_PIXELS = MAX_PIXELS

    for i, src in enumerate(args.images, 1):
        p = pathlib.Path(src)
        if p.suffix.lower() in (".heic", ".heif") and not HEIF:
            sys.exit(f"{p.name}: HEIC を読むには pillow-heif が必要です（pip install pillow-heif）")
        before = p.stat().st_size
        with Image.open(p) as raw:
            raw.load()
            im = clean(raw)
        base = f"{args.name}-{i}"
        made = []
        for w in sorted(set(args.widths)):
            r = resize(im, w)
            for fmt, ext in (("AVIF", "avif"), ("WEBP", "webp")):
                if fmt == "AVIF" and not features.check("avif"):
                    continue
                dst = out / f"{base}-{r.width}.{ext}"
                size = save(r, dst, fmt)
                made.append((dst, r.width, r.height, size))
        if i == 1 and args.og:
            dst = out / f"{args.name}-og.webp"
            og_crop(im).save(dst, "WEBP", quality=WEBP_QUALITY, method=6)
            made.append((dst, 1200, 630, dst.stat().st_size))

        print(f"\n{p.name}: 元 {before / 1024:.0f}KB（{im.width}×{im.height}）、メタ情報を削除")
        for dst, w, h, size in made:
            print(f"  {dst}  {w}×{h}  {size / 1024:.0f}KB")

        # <picture> の例（最大幅の画像の縦横比を width/height に入れる）
        alt = html.escape(args.alt[i - 1] if i - 1 < len(args.alt) else "")
        rel = lambda d: "/" + str(d).split("public/", 1)[-1] if "public/" in str(d) else str(d)
        avifs = [(d, w) for d, w, h, s in made if d.suffix == ".avif"]
        webps = [(d, w, h) for d, w, h, s in made if d.suffix == ".webp" and "-og" not in d.name]
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
