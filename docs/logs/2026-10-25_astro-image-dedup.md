# 2026-10-25 Astro の画像最適化の重複をなくす

- きっかけ: オーナーから「Astro がビルド時に同じ画像最適化をしているなら、スキル側の処理を削除してほしい」と依頼
- 変えたファイル: skills/site-content-update/scripts/optimize_images.py、skills/site-content-update/SKILL.md、CHANGELOG.md

## やったこと

1. 重複の有無を確認した。例のサイト（ai-web-creator-example-astro）は画像を `public/img/` に置き、`<img srcset>` で直接参照している。`astro:assets` は使っておらず、Astro は `public/` の画像を変換しないため、今の標準の構成では重複していない。そのため、スクリプトの変換は Astro のサイトでも残した
2. `astro:assets`（`<Image>`、`<Picture>`、Markdown の画像）を使うサイトでは、縮小と変換が二重になり、画質も二度落ちる。この場合のために `--mode clean` を追加した。メタ情報の削除、向きの反映、sRGB への統一と、上限の幅までの縮小だけを行い、元の形式で1枚だけ書き出す（JPEG は品質90）。Markdown と `<Picture>` の例を表示する
3. SKILL.md の手順4に、`public/` に置く場合と `astro:assets` を使う場合の分け方を書いた

## 確認したこと

- 例のサイトの `astro.config.mjs`、`src/` の全ページ、`public/img/` を読み、`astro:assets` を使っていないことを確認した（2026-10-25）
- 試験用の画像（EXIF の回転情報付きの 3000×2000 の JPEG と、透過 PNG）で `--mode clean` と `--mode auto` を実行し、clean では EXIF が消え、1600px に縮小された JPEG 1枚と OG 画像だけができることを確認した

## 確認できなかったこと

- `astro:assets` を使う実際のサイトでのビルド（例のサイトは使っていないため）

## 次回の改善点

- 元の画像が `--widths` のどれよりも小さいと、`auto` / `convert` で同じ幅のファイルが重複して srcset に並ぶ。重複を除くとよい（同じ日に対応済み。幅を元の画像の幅で頭打ちにしてから重複を除くようにした）
