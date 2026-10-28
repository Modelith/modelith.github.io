// マニュアルの版ごとのページ（ガイド・図・SysML v2）を、別の版のフォルダへ写す。
// 版の切り替えは、よくあるドキュメントサイト（Docusaurus など）と同じく、パスで行う：
//   /        … 安定版（いまの正式版、無ければ最新の rc）
//   /next/   … プレビュー版（開発中の次の版）
//   /0.1/ など … 過去の版（次の正式版を出したときに残す）
//
// 使い方:
//   node scripts/copy-version.mjs <写す元> <写す先>
//   写す元・写す先は、安定版なら "."、それ以外はフォルダ名（"next"・"0.1" など）
// 例:
//   node scripts/copy-version.mjs . next     # 安定版を写して、プレビュー版のマニュアルを始める
//   node scripts/copy-version.mjs . 0.1      # 正式版を出す前に、今の安定版を 0.1 として残す
//   node scripts/copy-version.mjs next .     # プレビュー版を安定版に上げる
//
// ページの中の、ほかの版ごとのページへのリンク（/guide/… など）は、写す先の版のパスに書き換える。
// リリースノート・ロードマップ・ライセンス・画像・例のモデルは、版に関係なく 1 つだけなので写さない。

import { cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/** 版ごとに持つ節（docs の下のフォルダ）。 */
export const SECTIONS = ["guide", "diagrams", "sysml"];

/**
 * 版の名前から、パスの前置きを作る。
 *
 * @param version 版（"." は安定版）
 * @returns パスの前置き（安定版は ""、それ以外は "next/" など）
 * @example
 * prefixOf(".")    // → ""
 * prefixOf("next") // → "next/"
 */
export function prefixOf(version) {
  return version === "." ? "" : `${version}/`;
}

/**
 * ページの中の、版ごとのページへのリンクを、写す先の版のパスに書き換える。
 *
 * @param text ページの Markdown
 * @param from 写す元の版（"." は安定版）
 * @param to 写す先の版
 * @returns 書き換えた Markdown
 * @example
 * rewriteLinks("[見方](/guide/screen)", ".", "next")       // → "[見方](/next/guide/screen)"
 * rewriteLinks("[見方](/next/guide/screen)", "next", ".")  // → "[見方](/guide/screen)"
 * rewriteLinks("![図](/images/a.jpg)", ".", "next")       // → "![図](/images/a.jpg)"（版に関係ないものは変えない）
 */
export function rewriteLinks(text, from, to) {
  const src = prefixOf(from).replace(/[.]/g, "\\.");
  const re = new RegExp(`(\\]\\(|href="|link: ")/${src}(${SECTIONS.join("|")})(?=[/)#"])`, "g");
  return text.replace(re, `$1/${prefixOf(to)}$2`);
}

/**
 * フォルダの中の Markdown を、リンクを書き換えながら写す（ほかのファイルはそのまま写す）。
 *
 * @param srcDir 写す元のフォルダ
 * @param dstDir 写す先のフォルダ
 * @param from 写す元の版
 * @param to 写す先の版
 */
function copyDir(srcDir, dstDir, from, to) {
  cpSync(srcDir, dstDir, { recursive: true });
  for (const name of readdirSync(dstDir)) {
    const p = join(dstDir, name);
    if (statSync(p).isDirectory()) copyDir(join(srcDir, name), p, from, to);
    else if (name.endsWith(".md")) writeFileSync(p, rewriteLinks(readFileSync(p, "utf8"), from, to));
  }
}

/**
 * 版ごとの節を、写す元の版から写す先の版へ写す。写す先に同じ節があれば、先に消す。
 *
 * @param docs docs フォルダのパス
 * @param from 写す元の版
 * @param to 写す先の版
 */
export function copyVersion(docs, from, to) {
  for (const s of SECTIONS) {
    const src = join(docs, prefixOf(from), s);
    const dst = join(docs, prefixOf(to), s);
    if (!existsSync(src)) throw new Error(`${src} がありません`);
    rmSync(dst, { recursive: true, force: true });
    copyDir(src, dst, from, to);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [from, to] = process.argv.slice(2);
  if (!from || !to || from === to) {
    console.error("使い方: node scripts/copy-version.mjs <写す元> <写す先>（安定版は \".\"）");
    process.exit(1);
  }
  const docs = resolve(dirname(fileURLToPath(import.meta.url)), "../docs");
  copyVersion(docs, from, to);
  console.log(`${from} の ${SECTIONS.join("・")} を ${to} へ写しました`);
}
