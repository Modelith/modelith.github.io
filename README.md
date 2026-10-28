# modelith.github.io

[Modelith](https://github.com/modelith/modelith) の利用者向けマニュアル（日本語）のソースです。
[VitePress](https://vitepress.dev/) で作り、<https://modelith.github.io/> に公開します。

- Modelith のアプリ本体は <https://modelith.github.io/modelith/>（[modelith/modelith](https://github.com/modelith/modelith) からビルド。AGPL-3.0）です。このリポジトリには含みません。
- このリポジトリの文章・画像・例のモデルは [MIT ライセンス](LICENSE) です。

## 構成

```
docs/
  index.md                  ホーム
  guide/                    ガイド（Modelith とは・はじめての図・テキストで書く・行き来する・画面の見方・ファイル・プラグイン・よくある質問）
  diagrams/                 図の種類ごとのページ
  sysml/                    SysML v2 の書き方入門・対応している書き方
  next/                     プレビュー版のマニュアル（guide・diagrams・sysml を同じ形で持つ。パス /next/）
  releases/                 リリースノート（modelith の docs/releases から写す）
  roadmap.md・license.md
  public/images/            スクリーンショット（scripts/screenshots.mjs で撮る）
  public/examples/          マニュアルの例のモデル（ダウンロードできる）
  .vitepress/config.mts     サイトの設定（ナビゲーション・サイドバー・検索の日本語表示）
scripts/
  screenshots.mjs           スクリーンショットを撮り直す
  import-release-notes.mjs  リリースノートを写す
  copy-version.mjs          版のページ（guide・diagrams・sysml）を別の版のフォルダへ写す
```

## マニュアルの版

アプリに安定版（`/modelith/`）とプレビュー版（`/modelith/preview/`）があるのに合わせて、マニュアルも版ごとにフォルダを分け、パスで切り替えます。
上のメニューの「マニュアルの版」で選べ、プレビュー版のページには、そのことと安定版の同じページへのリンクを示す帯が出ます。

| パス | フォルダ | 内容 |
| --- | --- | --- |
| `/guide/` など | `docs/guide`・`docs/diagrams`・`docs/sysml` | 安定版（いまは 0.1） |
| `/next/guide/` など | `docs/next/` の下の同じ 3 つ | プレビュー版（いまは開発中の 0.2） |

次の正式版を出したら、今の安定版を版の名前のフォルダに残し、プレビュー版を安定版に上げます。

```bash
node scripts/copy-version.mjs . 0.1     # 今の安定版を /0.1/ に残す
node scripts/copy-version.mjs next .    # プレビュー版を安定版に上げる
```

そのあと `docs/.vitepress/config.mts` の `STABLE`・`NEXT`、サイドバー、「マニュアルの版」の項目を合わせます。

## 手元で動かす

Node.js 22 が必要です。

```bash
npm ci
npm run docs:dev       # http://localhost:5173/ で開く（編集するとすぐ反映）
npm run docs:build     # docs/.vitepress/dist にビルド。リンク切れがあると失敗する
npm run docs:preview   # ビルドしたサイトを確かめる
```

依存は `npm ci` で入れます。インストール時のスクリプトは `.npmrc` で止めてあり、公開から 7 日たっていない版は入れません（急ぎのセキュリティ修正は除く）。
決まりの全体は Modelith の [依存の追加・更新](https://github.com/modelith/modelith/blob/dev/CONTRIBUTING.md#依存の追加更新) に従います。

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
