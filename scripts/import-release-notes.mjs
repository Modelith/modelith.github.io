// modelith リポジトリのリリースノート（docs/releases/*.md）を、このサイトのページに写す。
//
// 使い方:
//   node scripts/import-release-notes.mjs [modelith の docs/releases のパス]
//   （既定は ../modelith/docs/releases）
//
// どのノートにもある「ご注意」「商標」「ライセンス」の節と、最後の問い合わせ先の行は、
// サイトでは「ライセンスと商標」のページに 1 回だけ書くので、写すときに外す。
// 新しいバージョンを足したら、docs/.vitepress/config.mts の RELEASES と、docs/releases/index.md の一覧も更新する。

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = resolve(ROOT, process.argv[2] ?? "../modelith/docs/releases");
const OUT = join(ROOT, "docs/releases");

/** サイトに写さない節の見出し。 */
const DROP = new Set(["ご注意", "商標", "ライセンス"]);

/**
 * リリースノートの本文から、写さない節と最後の問い合わせ先の行を外し、ページの末尾の案内を足す。
 *
 * @param text リリースノートの Markdown
 * @returns サイトのページの Markdown
 */
function convert(text) {
  const out = [];
  let drop = false;
  for (const line of text.split("\n")) {
    const h = /^## (.+)$/.exec(line);
    if (h) drop = DROP.has(h[1].trim());
    if (drop || line.startsWith("不具合のご報告やご要望は")) continue;
    out.push(line);
  }
  while (out.length && out[out.length - 1].trim() === "") out.pop();
  out.push(
    "",
    "---",
    "",
    "このノートは [modelith リポジトリ](https://github.com/modelith/modelith/tree/dev/docs/releases) から写したものです。ご注意・商標・ライセンスは [ライセンスと商標](/license) をご覧ください。",
    "",
  );
  return out.join("\n");
}

for (const f of readdirSync(SRC).filter((f) => /^v.+\.md$/.test(f))) {
  writeFileSync(join(OUT, f), convert(readFileSync(join(SRC, f), "utf8")));
  console.log(`docs/releases/${f}`);
}
