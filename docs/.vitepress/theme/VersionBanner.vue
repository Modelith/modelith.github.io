<script setup lang="ts">
// プレビュー版（/next/）のマニュアルのページの上に出す帯。安定版の同じページと、プレビュー版のアプリへのリンクを示す。
import { computed } from "vue";
import { useRoute, withBase } from "vitepress";

const route = useRoute();
/** プレビュー版のページか。 */
const isNext = computed(() => route.path.startsWith("/next/"));
/** 安定版の同じページのパス。 */
const stablePath = computed(() => route.path.replace(/^\/next\//, "/"));
</script>

<template>
  <div v-if="isNext" class="version-banner" role="note">
    これは開発中の次の版（プレビュー版）のマニュアルです。書いてある操作は
    <a href="https://modelith.github.io/modelith/preview/" target="_blank" rel="noreferrer">プレビュー版のアプリ</a>
    で使えます。安定版をお使いの方は、<a :href="withBase(stablePath)">安定版のマニュアル</a>をご覧ください。
  </div>
</template>

<style scoped>
.version-banner {
  margin: 0 0 24px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-warning-2);
  background: var(--vp-c-warning-soft);
  font-size: 14px;
  line-height: 1.6;
}
.version-banner a {
  color: var(--vp-c-brand-1);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
