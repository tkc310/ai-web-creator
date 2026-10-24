# 2026-10-24 クラウドの作業環境から本番のサイトを Lighthouse で計測する

- きっかけ: HTML パターンの検証で、作業環境から npm と本番のサイトに届かず、run_lighthouse.sh が動かなかった（docs/logs の過去の改善メモと、サンプルのサイトの改善点の一覧）
- 変えたファイル: skills/web-creator/references/quality-gate.md、skills/web-creator/scripts/run_lighthouse.sh、README.md

## やったこと

1. quality-gate.md に「作業環境から本番のサイトに届かないとき」を追加した。Cowork と Claude Code のそれぞれで、ネットワークの許可にサイトのホストを足す場所と選ぶものを表にした。「Additional allowed domains」が効かない不具合の報告と、そのときの代わり（計測のあいだだけ All domains / Full）も書いた
2. quality-gate.md に「オーナーに計測してもらう（最後の手段）」として PageSpeed Insights の手順を追加した
3. run_lighthouse.sh で、計測の前に対象のページに届くかを確かめ、届かなければホスト名と対処を表示して止まるようにした（localhost は確かめない）
4. run_lighthouse.sh の「要改善」を、点数に関係する（重みが0より大きい）項目だけに絞った。参考の項目（Network dependency tree など）まで出て、直す必要がないものが並んでいたため
5. README.md の品質の説明に、本番のサイトでも測ることと、届かないときの案内を足した

## 確認したこと

- Cowork のクラウドの作業環境で、オーナーが設定 → 機能のネットワークの許可を「Package managers only」にし、「Additional allowed domains」に `*.<サブドメイン>.workers.dev` と `pagespeed.web.dev` を足したところ、1分以内に両方へ届くようになった（2026-10-24）。不具合の報告とは違い、この時点では効いた
- 同じ設定で npm から lighthouse 13.5.0 を取得でき、run_lighthouse.sh で本番のサイトをモバイル設定で計測できた（4項目とも100）。オーナーが PageSpeed Insights で測った結果（4項目とも100、Lighthouse 13.5.0）と一致した
- 許可していないホスト（example.org）では、run_lighthouse.sh が理由を表示して終了コード 2 で止まった
- Claude Code のクラウド環境の設定の場所と、Custom と既定の一覧の扱い、変更が動いている会話に約1分で反映されること: https://code.claude.com/docs/en/cloud-environments （2026-10-24 確認）
- Cowork のクラウドセッションは、チャットや Cowork と同じネットワークの設定を使う: https://support.claude.com/en/articles/14479288-claude-cowork-architecture-overview （2026-10-24 確認）
- 「Additional allowed domains」が効かない不具合の報告（2026年3月〜9月）: https://claudeissues.com/issue/38984-bug-cowork-additional-allowed-domains-allowlist-non-functional

## 確認できなかったこと

- Claude Code（claude.ai/code）の環境の設定画面での実際の操作（オーナーは Cowork で作業していたため）
- Team・Enterprise のプランで、管理者でないメンバーが設定を変えられるか
- 作業環境のブラウザで pagespeed.web.dev の画面を操作する方法（Lighthouse 本体で測れたため試していない。計測ページは Google の API なども使うため、ほかのホストの許可も必要になる可能性がある）

## 次回の改善点

- GitHub Actions で公開のたびに Lighthouse を回し、点数を Issue に書き出す方法（作業環境の設定を変えられない人向け）を検討する
- account-setup.md か docs/claude-account.md の最初の設定に、ネットワークの許可にサイトのホストを足す手順を入れるか検討する（公開の前に済ませておけば、計測で止まらない）
