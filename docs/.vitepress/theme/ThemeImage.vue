<script setup lang="ts">
// 明るい配色と暗い配色で、別の画像を出す（スクリーンショット用）。
// どちらの画像も読み込み、表示は CSS（html.dark）で切り替える。
import { withBase } from "vitepress";

defineProps<{ light: string; dark: string; alt: string }>();
</script>

<template>
  <img class="theme-image only-light" :src="withBase(light)" :alt="alt" loading="lazy" />
  <img class="theme-image only-dark" :src="withBase(dark)" :alt="alt" loading="lazy" />
</template>
