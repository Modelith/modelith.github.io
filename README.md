# modelith.github.io

[Modelith](https://github.com/modelith/modelith) の利用者向けマニュアル（日本語）のソースです。
[VitePress](https://vitepress.dev/) で作り、<https://modelith.github.io/> に公開します。

- Modelith のアプリ本体は <https://modelith.github.io/modelith/>（[modelith/modelith](https://github.com/modelith/modelith) からビルド。AGPL-3.0）です。このリポジトリには含みません。
- このリポジトリの文章・画像・例のモデルは [MIT ライセンス](LICENSE) です。

## 構成

```
docs/
  index.md                  ホーム
  guide/                    ガイド（Modelith とは・はじめての図・画面の見方・ファイル・プラグイン・よくある質問）
  diagrams/                 図の種類ごとのページ
  sysml/                    SysML v2 の書き方入門・対応している書き方
  releases/                 リリースノート（modelith の docs/releases から写す）
  roadmap.md・license.md
  public/images/            スクリーンショット（scripts/screenshots.mjs で撮る）
  public/examples/          マニュアルの例のモデル（ダウンロードできる）
  .vitepress/config.mts     サイトの設定（ナビゲーション・サイドバー・検索の日本語表示）
scripts/
  screenshots.mjs           スクリーンショットを撮り直す
  import-release-notes.mjs  リリースノートを写す
```

## 手元で動かす

Node.js 22 が必要です。

```bash
npm ci
npm run docs:dev       # http://localhost:5173/ で開く（編集するとすぐ反映）
npm run docs:build     # docs/.vitepress/dist にビルド。リンク切れがあると失敗する
npm run docs:preview   # ビルドしたサイトを確かめる
```

## スクリーンショットを撮り直す

画面のスクリーンショットは、手元で動かした Modelith に、`docs/public/examples/` の例のモデルを読み込ませて撮ります。
アプリのサンプルや非公開の資料は使いません。

1. [modelith](https://github.com/modelith/modelith) を、このリポジトリの隣（`../modelith`）に clone し、アプリをビルドしてプレビューを起動します。

   ```bash
   cd ../modelith
   npm ci --prefix web
   scripts/build-wasm.sh
   npm run build --prefix web
   (cd web && npx vite preview --port 4190 --strictPort)
   ```

2. 別の端末で、このリポジトリから撮ります。Playwright と Chromium は modelith の `web` のものを借ります（`npx playwright install chromium` で入れておきます）。

   ```bash
   npm run screenshots
   # 一部だけ撮り直す：PARTS=desktop,phone npm run screenshots
   # 画像の名前で絞る：ONLY=diagram- npm run screenshots
   ```

   環境変数 `MODELITH_URL`（既定 `http://localhost:4190/`）・`MODELITH_WEB`（既定 `../modelith/web`）で、アプリの URL と modelith の場所を変えられます。

3. 撮り終えたら、プレビューを止めます。

## リリースノートを更新する

Modelith の新しいバージョンが出たら、リリースノートを写し、一覧を更新します。

```bash
node scripts/import-release-notes.mjs ../modelith/docs/releases
```

写したあと、`docs/.vitepress/config.mts` の `RELEASES` と `docs/releases/index.md` の一覧・最新の要約を更新します。
画面が変わったバージョンでは、マニュアルの本文とスクリーンショットも見直します。

## 公開

`main` に入ると、GitHub Actions（`.github/workflows/deploy.yml`）がビルドして GitHub Pages に公開します。
プルリクエストでは `.github/workflows/check.yml` がビルドとリンク切れを確かめます。

公開するには、リポジトリの **Settings → Pages → Build and deployment** の **Source** を **「GitHub Actions」** にしておく必要があります（最初に一度だけ）。

## 書き方

文章の決まりは [CLAUDE.md](CLAUDE.md) と、Modelith の [画面の言葉の手引き](https://github.com/modelith/modelith/blob/dev/docs/development/ui-writing.md) に従います。
