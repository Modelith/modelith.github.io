import { defineConfig } from "vitepress";
import { sysmlGrammar } from "./sysml-grammar";

const APP = "https://modelith.github.io/modelith/";
const REPO = "https://github.com/modelith/modelith";

/**
 * 見出しのアンカー（id）を作る。VitePress の既定と同じ規則で作り、最後に NFC に戻す。
 * 既定のままだと、濁点・半濁点を含む見出し（「ブラウザ」など）の id が分解された文字（NFD）のまま残り、
 * Markdown のリンク（NFC）と一致しないため。
 *
 * @param s 見出しの文字列
 * @returns アンカー（例：「3. 図で関係を足す」→「_3-図で関係を足す」）
 */
function slugify(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "")
    .replace(/[\u0000-\u001f]/g, "")
    .replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^(\d)/, "_$1")
    .toLowerCase()
    .normalize("NFC");
}

// リリースノートは新しい順に並べる
const RELEASES = ["0.1.0-beta.4", "0.1.0-beta.3", "0.1.0-beta.2", "0.1.0-beta.1", "0.1.0-alpha.10", "0.1.0-alpha.9", "0.1.0-alpha.8", "0.1.0-alpha.7", "0.1.0-alpha.6", "0.1.0-alpha.5", "0.1.0-alpha.4", "0.1.0-alpha.2"];

export default defineConfig({
  lang: "ja",
  title: "Modelith",
  titleTemplate: ":title | Modelith",
  description: "テキストと図を同期して編集できる、オープンソースの SysML v2 モデリングエディタ Modelith の使い方",
  base: "/",
  cleanUrls: true,
  lastUpdated: true,
  markdown: {
    // ```sysml のコードブロックに色を付ける
    languages: [sysmlGrammar as never],
    anchor: { slugify },
  },
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
    ["meta", { name: "theme-color", content: "#16293F" }],
  ],
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "ガイド", link: "/guide/what-is-modelith", activeMatch: "^/guide/" },
      { text: "図", link: "/diagrams/", activeMatch: "^/diagrams/" },
      { text: "SysML v2", link: "/sysml/basics", activeMatch: "^/sysml/" },
      { text: "リリースノート", link: "/releases/", activeMatch: "^/releases/" },
      { text: "ロードマップ", link: "/roadmap" },
      { text: "ブラウザで試す", link: APP },
    ],
    sidebar: {
      "/": [
        {
          text: "ガイド",
          items: [
            { text: "Modelith とは", link: "/guide/what-is-modelith" },
            { text: "はじめての図（図だけで作る）", link: "/guide/getting-started" },
            { text: "テキストで書く・行き来する", link: "/guide/text-and-diagram" },
            { text: "画面の見方", link: "/guide/screen" },
            { text: "ファイルとフォルダ", link: "/guide/files" },
            { text: "チェックルールとプラグイン", link: "/guide/plugins" },
            { text: "よくある質問・困ったとき", link: "/guide/faq" },
          ],
        },
        {
          text: "図",
          items: [
            { text: "図の種類と開き方", link: "/diagrams/" },
            { text: "トレーサビリティとフェーズ", link: "/diagrams/traceability" },
            { text: "ブロック定義図", link: "/diagrams/block-definition" },
            { text: "制御ループ", link: "/diagrams/control-loop" },
            { text: "内部ブロック図", link: "/diagrams/internal-block" },
            { text: "振る舞い", link: "/diagrams/behavior" },
            { text: "シーケンス図", link: "/diagrams/sequence" },
            { text: "アクティビティ図", link: "/diagrams/activity" },
            { text: "状態遷移図", link: "/diagrams/state-machine" },
            { text: "すべて", link: "/diagrams/all" },
            { text: "保存された図", link: "/diagrams/saved-views" },
            { text: "図の操作と書き出し", link: "/diagrams/editing" },
          ],
        },
        {
          text: "SysML v2",
          items: [
            { text: "書き方入門", link: "/sysml/basics" },
            { text: "対応している書き方", link: "/sysml/support" },
          ],
        },
        {
          text: "このプロジェクトについて",
          items: [
            { text: "リリースノート", link: "/releases/", collapsed: true, items: RELEASES.map((v) => ({ text: v, link: `/releases/v${v}` })) },
            { text: "ロードマップ", link: "/roadmap" },
            { text: "ライセンスと商標", link: "/license" },
          ],
        },
      ],
    },
    socialLinks: [{ icon: "github", link: REPO, ariaLabel: "Modelith の GitHub リポジトリ" }],
    editLink: {
      pattern: "https://github.com/modelith/modelith.github.io/edit/main/docs/:path",
      text: "このページの修正を提案する",
    },
    footer: {
      message: `このサイトの文章は <a href="https://github.com/modelith/modelith.github.io/blob/main/LICENSE">MIT ライセンス</a>です。Modelith 本体は <a href="${REPO}#license">AGPL-3.0（プラグイン例外付き）</a>です。`,
      copyright: "Copyright © 2026 The Modelith Authors",
    },
    search: {
      provider: "local",
      options: {
        translations: {
          button: { buttonText: "検索", buttonAriaLabel: "検索" },
          modal: {
            displayDetails: "詳しく表示",
            resetButtonTitle: "検索語を消す",
            backButtonTitle: "検索を閉じる",
            noResultsText: "見つかりませんでした",
            footer: { selectText: "選ぶ", selectKeyAriaLabel: "Enter", navigateText: "移動", navigateUpKeyAriaLabel: "上矢印", navigateDownKeyAriaLabel: "下矢印", closeText: "閉じる", closeKeyAriaLabel: "Esc" },
          },
        },
      },
    },
    outline: { level: [2, 3], label: "このページの内容" },
    docFooter: { prev: "前のページ", next: "次のページ" },
    lastUpdated: { text: "最終更新" },
    darkModeSwitchLabel: "配色",
    lightModeSwitchTitle: "明るい配色にする",
    darkModeSwitchTitle: "暗い配色にする",
    sidebarMenuLabel: "メニュー",
    returnToTopLabel: "ページの先頭へ",
    langMenuLabel: "言語",
    externalLinkIcon: true,
    notFound: {
      title: "ページが見つかりません",
      quote: "URL が変わったか、ページが削除された可能性があります。",
      linkLabel: "ホームへ戻る",
      linkText: "ホームへ戻る",
    },
  },
});
