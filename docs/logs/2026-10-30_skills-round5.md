# 2026-10-30 無人の保守でマージしない、clone の代わりの道、Organization の標準、check_text の誤検出

- きっかけ: スキルの評価（5回目の修正）で見つかった不具合と不足。無人の保守がプルリクエストをマージする書き方になっていた（スケジュールタスクは auto mode で動き、人が承認していないマージは止められる）。check_text.py がログの `iframe` のタグの書き方で自動修正を止めていた（手元で再現した）。clone が失敗したときの道がなかった。担当者の交代で、共有のログインの引き継ぎを書いていた（GitHub の規約では1つのログインを複数の人で使えない）。プレビューのコメントを Pro と Max でも勧めていた、など
- 変えたファイル: README.md、CHANGELOG.md、docs/（how-to-use.md、claude-account.md、forms.md、other-agents.md）、prompts/README.md、skills/web-creator/SKILL.md、skills/web-creator/references/（account-setup.md、article-tutorial.md、client-handoff.md、deploy-and-autofix.md、forms.md、migration.md、preview.md、project-setup.md、quality-gate.md、skills-install.md、stack-selection.md、versions.md）、skills/web-creator/scripts/check_text.py、skills/web-creator/templates/（AGENTS.md.tmpl、CLAUDE.md.tmpl、README.owner.md、SITE.md、handoff.md、project-instructions.md、github/dependabot.yml、github/workflows/autofix.yml）、skills/site-maintenance/（SKILL.md、references/routine-prompt.md、references/routine-setup.md）、skills/runtime-update/SKILL.md、skills/site-review/SKILL.md、skills/site-content-update/SKILL.md

## やったこと

1. 無人の保守でプルリクエストをマージしないようにした
   - site-maintenance に「無人の実行で守ること」と「main に入れる前の確認」を足した。パッチとマイナーは、`git status --porcelain` が空なのを確かめ、`pnpm install --frozen-lockfile` とビルド、runtime-update の確認、check_text.py を通し、main が進んでいないかを `merge-base --is-ancestor` で確かめてから `git push origin HEAD:main` で入れる。`git clean` と `git reset --hard` は分類器が止めるので使わない
   - メジャー（Node.js、pnpm、astro など）と GitHub Actions の更新は、確認を通したブランチのプルリクエストを残し、SITE.md の「オーナーへの確認待ち」に書く。マージは次の会話でオーナーの OK をもらってから
   - 止められた操作はやり直さない（同じ操作が3回続くか合わせて20回止められると、実行が人を待って止まるため）
   - routine-prompt.md の手順を同じ内容にし、routine-setup.md の承認の設定の説明を、auto mode で動くことと出典に置き換えた。オーナーに伝えること（History から確認に答える）を足した
   - runtime-update に「main に入れるかの決め方」を足し、依存パッケージの手順をパッチとマイナーのブランチ、メジャーの別のブランチに分けた。site-review の静的なサイトの更新も同じ決め方にした
2. check_text.py の誤検出を直した
   - 作業フォルダからの相対パスが `logs/` か `audit-log/` で始まるファイルは、埋め込みの書き方（MARKUP_PATTERNS）を調べない。`--no-markup` で同じことを指定できる
   - `--baseline <フォルダ>` を足した。同じ相対パスのファイルにすでにあった指摘を除く
   - autofix.yml の範囲の確認で、変わった `src/content/` のファイルの失敗した版を `$RUNNER_TEMP/autofix-baseline` に写し、check_text.py が `--baseline` を知っているときだけ付ける。Issue の本文の確認には `--no-markup` を付ける
3. autofix.yml のほかの直し
   - プロンプトの手順1を「SITE.md の『技術』と『更新の方法』だけを読む。CLAUDE.md と AGENTS.md の作業の決まりは当てはまらない」にし、CLAUDE.md のひな形の先頭にも同じことを書いた
   - ログにタグを山かっこのまま書かない、を足した
   - `--disallowedTools` に `env`、`printenv`、`set`、`export`、`declare`、`compgen` を足した（読み取りのコマンドは承認なしで通るため）
   - `execution_file` の最後の `result` の `subtype` が `error_max_turns` のときは、Issue に「決めた回数（30回）の操作の中で直しきれずに止まりました」と書く
4. スキルの取り込みの道を3つにした
   - A（clone）が失敗したら C（raw.githubusercontent.com から `MANIFEST.txt` のファイルを1つずつ取り、場所を `LICENSE` と `skills/` に限り、`sha256sum -c` で確かめる）、それも失敗したら推測せずに B（リリースの zip）を頼む。handoff.md、project-instructions.md、prompts/README.md にも書いた
   - 初回の手順1と更新の前に、`gh api 'repos/{owner}/{repo}' --jq .private` でサイトのリポジトリが非公開かを確かめる（公開なら終了コード3、確かめられなければ4）。client-handoff.md の手順4の前にも入れた
   - 初回の手順8の前に「公開の前の写しを main に入れます」と伝えて OK をもらう。AGENTS.md のひな形の4に例外として書いた
   - 「2回目以降のスレッド」の手順（SITE.md の作業用のブランチに `git fetch` と `git switch -C --track` で切り替える。main に入っていれば main に進める。ブランチがなければ止まる）を足し、CLAUDE.md のひな形の1から参照した
   - 更新の手順2で、浅い clone なら前の版のコミットを取り直す（`--depth 1` で取れなければ `--unshallow`）
   - 「B と C で取り込んだサイトの更新」に名前を変え、`source` が zip なら B、`commit: none` なら C、と見分けるようにした
5. 会社のアカウントを Organization にする
   - account-setup.md の基本方針を「1人1つのログイン。会社のサイトは GitHub の Organization に置く」にし、GitHub の規約の B.3 を出典に付けた。Organization の作り方、2人目の Owner、Cloudflare の2人目の Super Administrator、Account API tokens を勧めることを足した。通信の許可は Claude Code で初めて公開するときに頼む
   - site-review の「担当者が代わったとき」を書き直した。引き継ぐもの4つ（GitHub の Owner への招待か Transfer、Cloudflare の Super Administrator への招待、ドメインの会社の担当と連絡先、Watch）、作り直すもの5つ（CLOUDFLARE_API_TOKEN を足した）、外すもの5つ。共有のログインで作ってあった場合だけ、短い段落で移し方を書いた
   - SITE.md のひな形のアカウントの表に、持ち主、管理できる人の人数、2段階認証を足し、「オーナーへの確認待ち」の節を足した
6. プレビューの直し方を、Pro と Max はチャット、Team と Enterprise はコメントに分け、共有の注意をプランごとに書いた（preview.md、site-content-update、article-tutorial.md、SKILL.md、docs/how-to-use.md、README.md）
7. 予約投稿で、OK をもらったコミットを SITE.md とタスクの本文に書き、公開のときに `git diff --quiet <OK のコミット> HEAD -- <記事> <画像>` で変わっていないかを確かめる。変わっていたら公開せずに Issue で知らせる
8. ワークフローのファイルを push できないときの標準を「Upload files」の画面にし、`git pull --ff-only` と `cmp` で確かめる。Issue を `gh api` でラベルつきで作る書き方と、使えないときに SITE.md に書く道を足した。1ページのサイトでは autofix が効きにくいこと、GitHub Actions の無料枠（毎月12ドル分）を書いた
9. migration.md: 全体の流れに 1-0（`?p=` のパーマリンクの変更。変える前の控えと戻し方）と 5-0（前日の保存）を足した。段階2の0に前日の保存（保存先は会社のパソコンか社内の共有ドライブで、見られる人を限る）を書き、7章を「前日に保存したファイルが開けるかを確かめる」にした。MX はメールの会社の案内する名前を先にした。WXR の添付を探して `/tmp/wordpress-export` に移す手順と、添付できないときと管理者の権限がないときに `/wp-json/wp/v2/posts` と `/pages` から取る道を足した
10. docs/how-to-use.md: 版の確かめ方を「v で始まる版の名前」にした。「Code execution and file creation」をオンにできないときに、リリースの zip の中のファイルを添付する道を書いた。Organization の一文、保守の説明（小さな更新は自動、大きな更新は OK のあと）を足した
11. README.md: 必要なものに Code execution の設定を足した。保守の説明、取り込みの3つの道、Organization の一文を直した。「版の付け方」の手順を書き直した（手順2で CHANGELOG の「未リリース」を日付にし、`MANIFEST.txt` を作ってコミットする、`gh auth login`、手順3の実機での確認を足す、手順4に `env` の拒否と上限の Issue と iframe の baseline を足す、手順8で versions.md の未確認の行を直す）
12. CHANGELOG.md: いちばん上に `## v2026.11.0（未リリース）` を置き、2026-10-30 の4つの見出しと今回の分を `###` にしてその下にまとめた。それより古い見出しは `##` のまま
13. versions.md の「時点つきの事実」に、raw.githubusercontent.com と未接続のリポジトリの clone、スケジュールタスクと auto mode、読み取りのコマンド、`error_max_turns` と `execution_file`、アーティファクトのコメントとプラン、Upload files、Actions の無料枠、GitHub の規約 B.3 を足した
14. 小さな直し: 保守の間隔を「毎月1日と15日」にそろえた。project-setup.md の CLAUDE.md の説明を今のひな形に合わせた。プロジェクトでの effort の頼み方を Project settings → General → Thread effort にし、quality-gate.md に Project settings → Environment の分岐を足した。deploy-and-autofix.md の画像の種類に jpeg を足した

## 確認したこと

- check_text.py: 再現した誤検出（ログに iframe のタグ、終了コード1）が、直したあとは通った。記事の iframe が baseline にもあれば通り、新しく足したスクリプトのタグは止まった。ログの中の秘密の値と AI への命令の疑いは、今までどおり見つかった。`--no-markup` は作業フォルダの外のファイルにも効いた。baseline のパスがないときは終了コード1。`python3 -m py_compile` で通った。リポジトリ（docs/logs/ を除く）で0件
- autofix.yml: YAML として読み込めた。run のシェルをすべて `bash -n` で通した。範囲の確認と Issue の手順を、一時的な git リポジトリと偽の gh で動かし、baseline の写し、`--baseline` の有無の分岐、`error_max_turns` の書き分けを確かめた
- skills-install.md: 10のかたまりが `bash -n` で通った。C の道を手元の HTTP サーバーで試し、ファイルを書き換えたとき、一覧に想定外の場所があるときに止まることを確かめた。「2回目以降のスレッド」と浅い clone の更新の手順も一時的なリポジトリで動かした
- 変えた Markdown の中の bash のかたまり22個を `bash -n` で通した。リポジトリの YAML をすべて読み込めた
- 検索で確かめた事実（2026-10-30）:
  - スケジュールタスクは auto mode で動き、権限のモードは選べない。起動のプロンプトは承認の代わりにならない。既定で `claude/` のブランチに push する: https://code.claude.com/docs/en/routines
  - auto mode で既定で止められる操作（人が承認していないマージ、force push、`git reset --hard`、`git clean -fd`、本番への公開）と、通る操作（既定のブランチを含む push）、止まる回数（続けて3回、合わせて20回）: https://code.claude.com/docs/en/permission-modes
  - クラウドの作業環境で、公開リポジトリのファイルは raw.githubusercontent.com から届き、既定の Trusted の一覧に入っている。未接続のリポジトリの API と archive の取得は 403: https://code.claude.com/docs/en/cloud-environments
  - 読み取りのコマンドは承認なしで通る。Read の拒否はファイル名を書いたコマンドにだけ効く: https://code.claude.com/docs/en/permissions
  - 結果のメッセージの `error_max_turns`: https://code.claude.com/docs/en/agent-sdk/agent-loop 。claude-code-action の `execution_file`: https://github.com/anthropics/claude-code-action
  - アーティファクトのコメントは組織の中の共有で使う。Pro と Max は公開のリンクだけ: https://code.claude.com/docs/en/artifacts
  - GitHub の規約 B.3（1つのログインを複数の人で使えない）: https://docs.github.com/en/site-policy/github-terms/github-terms-of-service
  - GitHub Free の Actions は非公開のリポジトリで毎月12ドル分: https://docs.github.com/en/billing/concepts/product-billing/github-actions
  - Cloudflare の Account API tokens は、作った人がいなくなっても使い続ける用途に向く。いちばん上の役割は Super Administrator - All Privileges: https://developers.cloudflare.com/fundamentals/api/get-started/account-owned-tokens/ 、https://developers.cloudflare.com/fundamentals/manage-members/roles/
  - WordPress の REST API の `per_page` は100まで、`X-WP-TotalPages` で全体のページ数が分かる: https://developer.wordpress.org/rest-api/using-the-rest-api/pagination/

## 確認できなかったこと

- 配布元の main へのマージ、タグ、リリース、実機での確認。作者が行う作業なので行っていない。README の「版の付け方」の手順3と4に、確かめることを書いた
- プロジェクトのスレッドで、未接続の公開リポジトリを `git clone` できるか（文書に書かれていない）
- まだない `.github/workflows` のフォルダに「Upload files」で置けるか
- Pro で、作った本人が自分のアーティファクトにコメントを付けられるか
- 「Code execution and file creation」がオフのときに、添付したファイルで相談を進められるか。WXR を添付できる大きさの上限
- claude-code-action の中で `cat .git/config` と `env` が通らないか。`execution_file` の形
- Cloudflare の Account API tokens の画面に、Workers の公開に使うひな形があるか

## 次回の改善点

- 作者が手順3と4を行ったら、結果を versions.md の未確認の行に書き、preview.md と skills-install.md の分岐を実際に合わせて直す
- 評価の low のうち見送ったもの（note に zip を添付できるか、EmDash のログの先頭の一文はオーナーが決めること）を、決まったら直す
