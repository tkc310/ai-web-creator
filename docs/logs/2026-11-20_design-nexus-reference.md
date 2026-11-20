# 2026-11-20 design-nexus を同梱せず、リポジトリを参照する形にする

- きっかけ: 作者からの依頼。2026-11-18 に skills/design-nexus として同梱した design-nexus を、tkc310/design-nexus を参照する形にしたい
- 変えたファイル: skills/design-nexus/（削除）、skills/web-creator/references/external-skills.txt（新規）、skills/web-creator/scripts/fetch_external_skills.sh（新規）、skills/web-creator/references/（skills-install.md、build.md、versions.md）、.github/workflows/release.yml、README.md、AGENTS.md、docs/other-agents.md、CHANGELOG.md

## やったこと

1. 配布方針（タグ付きの版を取得して skills/ に写し、版を残す）に合わせ、参照しているスキルの一覧 external-skills.txt に、名前、リポジトリ、タグ、コミットを1行で書いた。design-nexus はタグがまだないので、コミット a0f7b84（0.10.0）で固定した
2. fetch_external_skills.sh を足した。一覧のコミット（タグがあればタグ）を `git fetch --depth 1` で取り、コミットが一覧と同じことを確かめてから、skills/<名前>/ と design-trends/ を置き、SOURCE に版を書く。同じ版がすでにあれば取りに行かない（zip で取り込んだとき）。コミットが違えば置かずに止まり（終了コード1）、取れなければ置かずに進む（終了コード2）
3. skills-install.md の初回の手順の3に、このスクリプトを動かして skills/VERSION に版の行を足すかたまりを足した。新しい版への更新でも取り直す
4. release.yml で、リリースの zip に同じ版の design-nexus を入れるようにした（clone できない作業環境の B の経路のため）
5. build.md、versions.md（「同梱しているスキル」を「参照しているスキル」に）、README（中身、スキルの構成、設計の方針、版の付け方の「参照しているスキルの更新」）、AGENTS.md、docs/other-agents.md を合わせた

## 確認したこと

- クラウドの作業環境で、fetch_external_skills.sh が design-nexus の a0f7b84 を取得でき、design-nexus の `node scripts/build.mjs` が作る dist/claude/design-nexus と、SOURCE のほかは同じ中身になった。2回目は取りに行かなかった（2026-11-20）
- GitHub は、コミットの SHA を指定した `git fetch` を受け付ける（今回の取得で確認）

## 次回の改善点

- design-nexus にタグが付いたら、external-skills.txt をタグで固定する
- v2026.11.2 を出すまで、main の MANIFEST.txt は v2026.11.1（design-nexus を同梱していた版）のままなので、main の check-skills（--manifest）は失敗する。v2026.11.2 の手順2で MANIFEST.txt を作り直す
