# modelith.github.io — エージェント向け作業ガイド

[Modelith](https://github.com/modelith/modelith) の利用者向けマニュアル（日本語、VitePress）。<https://modelith.github.io/> に公開する。ライセンスは MIT。

## 書き方

- 読み手は SysML v2 の書き方を知らない人。本体の [画面の言葉の手引き](https://github.com/modelith/modelith/blob/dev/docs/development/ui-writing.md) に従う（図の言葉を先に、SysML v2 の用語は補足に。図の種類は広く知られた名前で呼ぶ）。
- 画面の名前（メニュー・ボタン・トースト）は、アプリの表示どおりに書く（本体の `web/index.html`・`web/src/app/*.ts` で確かめる）。無い画面や操作を書かない。テキストでしかできないことは、テキストの例を示す。
- 書くのは、公開中のバージョンでアプリが実際にできることだけ。予定は [ロードマップ](docs/roadmap.md) に書く。
- 開発者向けの資料（ADR・要求仕様・対応表・貢献の手順）は写さず、modelith の GitHub へリンクする。
- 例のモデルは自分で作る（`docs/public/examples/`）。

## 非公開の資料

- 本体の `reference/mock/`（モックの HTML とその中のサンプルモデル）は非公開。中身を写さない。スクリーンショットにも使わない。
- スクリーンショットは `scripts/screenshots.mjs` で、`docs/public/examples/` の例のモデルだけを読み込んで撮る。

## 完了の定義

1. `npm run docs:build` が通る（リンク切れがあると失敗する。`ignoreDeadLinks` は使わない）
2. トピックブランチ（`docs/…`・`ci/…`・`chore/…` など）でコミットし、`main` へのプルリクエストにする。`main` へ直接 push しない
3. コミットとプルリクエストのタイトルは Conventional Commits（例：`docs(manual): add the state machine page`）

## コマンド

| 目的 | コマンド |
| --- | --- |
| ビルド（完了前に必須） | `npm run docs:build` |
| 手元で見る | `npm run docs:dev` |
| スクリーンショットを撮り直す | `npm run screenshots`（手順は README） |
| リリースノートを写す | `node scripts/import-release-notes.mjs ../modelith/docs/releases` |
