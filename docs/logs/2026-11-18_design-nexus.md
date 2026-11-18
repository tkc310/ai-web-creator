# 2026-11-18 デザインの手順を design-nexus スキルに切り替える

- きっかけ: 作者からの依頼。デザインの段階で、frontend-design の代わりに、作者が公開している design-nexus スキル（https://github.com/tkc310/design-nexus ）を使いたい
- 変えたファイル: skills/design-nexus/（新規。同梱）、skills/web-creator/references/build.md、skills/web-creator/references/versions.md、skills/web-creator/SKILL.md、skills/web-creator/templates/gitignore.txt、skills/web-creator/templates/claude/agents/site-builder.md、docs/other-agents.md、AGENTS.md、README.md、CHANGELOG.md

## やったこと

1. design-nexus 0.10.0（コミット a0f7b84）の `node scripts/build.mjs` が作る `dist/claude/design-nexus/` を、`skills/design-nexus/` に写して同梱した
   - 同梱にした理由: プロジェクトのスレッドはサイトのリポジトリの `.claude/skills/` を読まないので、frontend-design ではオーナーに claude.ai のアカウントで有効にしてもらう必要があった。`skills/` に入れれば、skills-install.md の取り込み（A・B・C のどの経路でも）で一緒に入り、タグで版も固定され、オーナーの操作が要らない
   - 流行の手法のデータベース（design-trends/）も、design-nexus の SKILL.md が読む場所（スキルの隣）に入る
2. build.md の「デザイン案の出し方」を design-nexus の build の手順に合わせ、「frontend-design スキルでのブラッシュアップ」を「design-nexus スキルの使い方」に置き換えた
   - 3案は design-nexus の Directions とトークン計画で作り、design-nexus は自分で1案を選んで進めるが、ここではオーナーに選んでもらう
   - 選んだ案のトークンをサイトの直下の DESIGN.md に書き、tokens-check.mjs で確かめる。ページは DESIGN.md のトークンだけで作る
   - 仕上げは lint.mjs、render-check.mjs（Playwright がなければ飛ばし、check_mobile_width.py で代える）、講評、装飾を1つ外す、DESIGN.md の記録
   - 決まりの合わせ方: ヒアリングの答え、共通の作り方、quality-gate.md、security-rules.md を design-nexus の「依頼」として渡し、design-nexus の既定より優先する。design-nexus の Ground の質問はしない。流行のデータベースはオーナーが求めたときだけ。NOTES.md は作らず実行ログに書く。ほかのデザインのスキルは同時に読み込まない
   - 「仕上げで見るところ」の5つの観点は、design-nexus を読み込めないときの代わりとして残した
3. レンダーチェックの保存先 `.design-nexus/` を、サイトの .gitignore のひな形に足した
4. site-builder に、DESIGN.md のトークンだけを使うことを足した
5. versions.md に「同梱しているスキル」を足し、design-nexus の取り込み元、版、コミット、写した日を書いた。README の「版の付け方」に「同梱しているスキルの更新」の手順を足し、AGENTS.md に skills/design-nexus を直接直さない決まりを足した

## 確認したこと

- `python3 .github/scripts/check_skills.py` と、check_text.py（check-skills.yml と同じ引数）で問題なし
- design-nexus のチェックのスクリプトは Node.js 26.13.0 以上が要る（design-nexus の README と SKILL.md、2026-11-18 確認）。サイトの Node.js（26.13.0）と同じ
- design-nexus の lint.mjs は `.astro` のファイルも調べる（lint.mjs の EXT、2026-11-18 確認）
- Claude Code のプロジェクトのスレッドから、つないでいない公開リポジトリ（tkc310/design-nexus）の `git clone --depth 1` が通った（2026-11-18）。versions.md の「時点つきの事実」に足した

## 次回の改善点

- 実際のサイトで design-nexus の3案と仕上げを1回通し、ヒアリングとの重なり（Ground の質問）や、DESIGN.md と SITE.md の分担に無理がないかを確かめる
- design-nexus には LICENSE のファイルがない。同梱して配るので、作者がライセンスを決めて design-nexus に置くか、この配布元の LICENSE で扱うかを決める
- design-nexus を更新したら、README の「同梱しているスキルの更新」で差し替える
