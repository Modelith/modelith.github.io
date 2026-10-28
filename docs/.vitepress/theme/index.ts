import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import { h } from "vue";
import ThemeImage from "./ThemeImage.vue";
import VersionBanner from "./VersionBanner.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  // プレビュー版（/next/）のページの本文の上に、版を示す帯を出す
  Layout: () => h(DefaultTheme.Layout, null, { "doc-before": () => h(VersionBanner) }),
  enhanceApp({ app }) {
    app.component("ThemeImage", ThemeImage);
  },
} satisfies Theme;
