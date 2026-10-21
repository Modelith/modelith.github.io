// マニュアルのスクリーンショットを撮り直すスクリプト。
//
// 使い方（README の「スクリーンショットを撮り直す」も参照）:
//   1. modelith リポジトリでアプリをビルドし、プレビューを起動する
//        scripts/build-wasm.sh && npm run build --prefix web
//        (cd web && npx vite preview --port 4190 --strictPort)
//   2. このリポジトリで実行する
//        MODELITH_WEB=../modelith/web node scripts/screenshots.mjs
//
// 環境変数:
//   MODELITH_URL  アプリの URL（既定 http://localhost:4190/）
//   MODELITH_WEB  Playwright を借りる modelith の web フォルダ（既定 ../modelith/web）
//   ONLY          撮る画像の名前を正規表現で絞り込む（例 ONLY=diagram-）
//   PARTS         撮る場面をカンマ区切りで絞り込む（desktop,dark,coffee,tutorial,text,phone）
//
// モデルは docs/public/examples/ の自作の例だけを使う（アプリのサンプルや非公開の資料は使わない）。
// フォルダを開く操作は、ブラウザ内のファイルシステム（OPFS）を返すように置き換えて、ダイアログを出さずに行う。

import { createRequire } from "node:module";
import { mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const URL_ = process.env.MODELITH_URL ?? "http://localhost:4190/";
const WEB = resolve(ROOT, process.env.MODELITH_WEB ?? "../modelith/web");
const OUT = join(ROOT, "docs/public/images");
const EXAMPLES = join(ROOT, "docs/public/examples");
const ONLY = process.env.ONLY ? new RegExp(process.env.ONLY) : null;
const PARTS = process.env.PARTS ? new Set(process.env.PARTS.split(",")) : null;
const want = (part) => !PARTS || PARTS.has(part);

const { chromium } = createRequire(join(WEB, "package.json"))("@playwright/test");

const examples = Object.fromEntries(
  readdirSync(EXAMPLES)
    .filter((f) => f.endsWith(".sysml"))
    .map((f) => [f, readFileSync(join(EXAMPLES, f), "utf8")]),
);

const DESKTOP = { width: 1360, height: 820 };
const PHONE = { width: 390, height: 844 };

/**
 * ブラウザの中で動く準備。フォルダのピッカーを、OPFS の決まったフォルダを返すものに置き換え、
 * 開くタブを「すべて」の 1 つにしておく（アプリのサンプルのタブを引き継がない）。
 *
 * @param folder ピッカーが返す OPFS のフォルダ名
 */
function prepare(folder) {
  const dir = async () => (await navigator.storage.getDirectory()).getDirectoryHandle(folder, { create: true });
  window.showDirectoryPicker = async () => dir();
  if (!sessionStorage.getItem("prepared")) {
    localStorage.setItem("modelith-tabs-v1", JSON.stringify({ tabs: [{ id: 1, view: "all", ctx: null, phase: "" }], active: 1 }));
    sessionStorage.setItem("prepared", "1");
  }
}

/**
 * 新しいページを開き、アプリが描き終わるまで待つ。
 *
 * @param browser Playwright のブラウザ
 * @param opts viewport・colorScheme・folder（ピッカーが返すフォルダ名）・files（そのフォルダに置くファイル）
 * @returns ページ
 */
async function openApp(browser, { viewport = DESKTOP, colorScheme = "light", folder = "examples", files = examples, scale = 1 } = {}) {
  const ctx = await browser.newContext({ viewport, colorScheme, deviceScaleFactor: scale, hasTouch: viewport === PHONE, isMobile: viewport === PHONE });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.error("画面の例外:", e.message));
  await page.addInitScript(prepare, folder);
  await page.goto(URL_);
  await page.locator("#gNodes .node").first().waitFor();
  await page.evaluate(
    async ([folder, files]) => {
      const root = await (await navigator.storage.getDirectory()).getDirectoryHandle(folder, { create: true });
      for (const [name, text] of Object.entries(files)) {
        const w = await (await root.getFileHandle(name, { create: true })).createWritable();
        await w.write(text);
        await w.close();
      }
    },
    [folder, files],
  );
  return page;
}

/** 起動時に開いているアプリのサンプルを、保存せずに閉じる。 */
async function closeSample(page) {
  await page.locator("#explorer [data-close]").first().click();
  await page.locator('#dialogButtons button:has-text("保存しない")').click();
  await page.locator('#explorer .msg:has-text("開いているファイルはありません")').waitFor();
}

/** 「フォルダを開く」で OPFS のフォルダを開く。 */
async function openFolder(page) {
  await page.locator('#noDoc [data-nodoc="openFolder"], #explorer [data-cmd="openFolder"]').first().click();
  await page.locator("#explorer .fi[data-file]").first().waitFor();
}

/** エクスプローラーのフォルダから、名前のファイルを開く。 */
async function openFile(page, name) {
  await page.locator(`#explorer .fi[data-file]:has-text("${name}")`).click();
  await settle(page);
}

/** 解析と描画が落ち着くまで待つ。 */
async function settle(page, ms = 700) {
  await page.waitForTimeout(ms);
}

/**
 * ＋メニューから組み込みの図を開き、ほかのタブを閉じる。
 *
 * @param id 図の ID（trace・structure・control・ibd・behavior・seq・afv・all）
 */
async function showView(page, id) {
  await page.evaluate(() => (document.querySelector(".tabadd").open = true));
  await page.locator(`.tabadd [data-open="${id}"]`).click();
  await settle(page);
  await closeOtherTabs(page);
}

/** 表示中のタブ以外を閉じる。 */
async function closeOtherTabs(page) {
  for (;;) {
    const other = page.locator('.tab[aria-selected="false"] .x').first();
    if (!(await other.count())) break;
    await other.click();
    await page.waitForTimeout(150);
  }
  await settle(page, 300);
}

/** 図の対象（内部ブロック図の対象ブロックなど）を選ぶ。 */
async function pickContext(page, name) {
  await page.locator("#ctxSel").selectOption({ label: name });
  await settle(page);
}

/** メニューバーの「表示」から、ツリーの表示を切り替える。 */
async function toggleTree(page) {
  await page.locator("#viewMenu summary").click();
  await toggleTree(page);
  await settle(page, 300);
}

/** 全体図（ミニマップ）を閉じる。 */
async function hideMinimap(page) {
  if (await page.locator("#mini").isVisible()) await page.locator("#miniHide").click();
}

/** 全体を表示してから、n 回拡大する。 */
async function zoom(page, n) {
  await page.locator("#zFit").click();
  for (let i = 0; i < n; i++) await page.locator("#zIn").click();
  await settle(page, 300);
}

/** 図の要素を名前でクリックして選ぶ。 */
async function clickNode(page, key) {
  await page.locator(`#gNodes [data-key="${key}"]`).first().click();
  await settle(page, 300);
}

/** 開いているメニューやトーストを片付ける。 */
async function tidy(page) {
  await page.evaluate(() => {
    document.querySelectorAll("details.menu[open]").forEach((d) => (d.open = false));
    const t = document.querySelector("#toast");
    if (t) t.classList.remove("on", "show");
  });
  await page.mouse.move(2, 400);
  await page.waitForTimeout(200);
}

/** トーストが消えるまで待つ。 */
async function waitToast(page) {
  await page.waitForTimeout(3200);
}

/**
 * 画面を JPEG で保存する。
 *
 * @param name 画像の名前（拡張子なし）
 * @param opts clip（切り抜く範囲）・element（その要素だけ）
 */
async function shot(page, name, { clip, element } = {}) {
  if (ONLY && !ONLY.test(name)) return;
  const path = join(OUT, `${name}.jpg`);
  const opt = { path, type: "jpeg", quality: 82 };
  if (element) await page.locator(element).screenshot(opt);
  else await page.screenshot(clip ? { ...opt, clip } : opt);
  console.log(`${name}.jpg  ${Math.round(statSync(path).size / 1024)} KB`);
}

/** 要素の画面上の範囲（少し広げる）。 */
async function boxOf(page, selector, pad = 0) {
  const b = await page.locator(selector).first().boundingBox();
  return { x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), width: b.width + pad * 2, height: b.height + pad * 2 };
}

/**
 * 画面の部分に番号の札を重ねる（「画面の見方」の図に使う。アプリの画面そのものは変えない）。
 *
 * @param marks [セレクタ, 番号, 札を置く位置（"tl" 左上・"c" 中央）] の並び
 */
async function badge(page, marks) {
  await page.evaluate((marks) => {
    for (const [sel, n, at] of marks) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const b = document.createElement("div");
      b.className = "doc-badge";
      b.textContent = String(n);
      const x = { c: r.left + r.width / 2 - 14, tr: r.right - 34, r: r.right + 4, l: r.left - 32 }[at] ?? r.left + 6;
      const y = at === "c" ? r.top + r.height / 2 - 14 : at === "r" || at === "l" ? r.top + r.height / 2 - 14 : r.top + 6;
      Object.assign(b.style, {
        position: "fixed", left: `${x}px`, top: `${y}px`, width: "28px", height: "28px", borderRadius: "50%",
        background: "#e8590c", color: "#fff", font: "700 15px/28px system-ui, sans-serif", textAlign: "center",
        boxShadow: "0 0 0 3px #fff, 0 2px 6px rgba(0,0,0,.35)", zIndex: "99999", pointerEvents: "none",
      });
      document.body.append(b);
    }
  }, marks);
}

/** 番号の札を消す。 */
async function unbadge(page) {
  await page.evaluate(() => document.querySelectorAll(".doc-badge").forEach((b) => b.remove()));
}

// ---------------------------------------------------------------------------

/** 全体の画面・画面の見方・図の種類・インスペクタ・問題一覧・語の説明（広い画面）。 */
async function desktopShots(browser, colorScheme) {
  const page = await openApp(browser, { colorScheme });
  await closeSample(page);
  if (colorScheme === "light") await shot(page, "files-no-document");
  await openFolder(page);
  await openFile(page, "robot-vacuum.sysml");

  // 全体の画面
  await showView(page, "structure");
  await page.locator("#sideModel").click();
  await zoom(page, 0);
  await clickNode(page, "Battery");
  await tidy(page);
  if (colorScheme === "dark") {
    await shot(page, "overview-dark");
    await page.context().close();
    return;
  }
  await shot(page, "overview");
  await page.locator("#sideFiles").click();
  await page.keyboard.press("Escape");
  await settle(page, 300);
  await shot(page, "explorer-folder", { clip: { ...(await boxOf(page, ".treepane")), height: 320 } });

  // ＋メニュー
  await page.evaluate(() => (document.querySelector(".tabadd").open = true));
  await settle(page, 300);
  await shot(page, "plus-menu", { clip: { x: 250, y: 50, width: 560, height: 560 } });
  await tidy(page);

  // 図の種類（ロボット掃除機）。サイドバーを隠して図を広くする
  await hideMinimap(page);
  await toggleTree(page);
  await showView(page, "structure");
  await zoom(page, 0);
  await shot(page, "diagram-block-definition");

  await showView(page, "ibd");
  await pickContext(page, "Vacuum");
  await zoom(page, 0);
  await shot(page, "diagram-internal-block");

  await showView(page, "behavior");
  await zoom(page, 0);
  await shot(page, "diagram-behavior");

  await showView(page, "seq");
  await zoom(page, 0);
  await shot(page, "diagram-sequence");

  await showView(page, "afv");
  await zoom(page, 0);
  await shot(page, "diagram-activity");

  // 状態遷移図はツリーから開く
  await toggleTree(page);
  await page.locator("#sideModel").click();
  const row = page.locator('#tree .ti:has(.nm:text-is("VacuumStates"))');
  await row.hover();
  await shot(page, "tree-open-button", { clip: await boxOf(page, ".treepane") });
  await row.locator("[data-open]").click();
  await settle(page);
  await closeOtherTabs(page);
  await page.keyboard.press("Escape");
  await toggleTree(page);
  await zoom(page, 0);
  await shot(page, "diagram-state-machine");

  await showView(page, "all");
  await zoom(page, 0);
  await shot(page, "diagram-all");

  // インスペクタと右クリックメニュー
  await showView(page, "structure");
  await zoom(page, 0);
  await clickNode(page, "Vacuum");
  await shot(page, "inspector", { clip: await boxOf(page, ".diagrampane") });
  const v = await page.locator('#gNodes [data-key="Battery"]').boundingBox();
  await page.mouse.click(v.x + v.width / 2, v.y + 12, { button: "right" });
  await settle(page, 300);
  await shot(page, "context-menu", { clip: await boxOf(page, ".diagrampane") });
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");

  // 図を保存
  await page.locator("#btnSaveView").click();
  await page.locator("#dialog").waitFor();
  await page.locator("#dialog input").first().fill("構成の概要");
  await shot(page, "save-view-dialog");
  await page.locator('#dialogButtons button:has-text("保存")').click();
  await settle(page, 1200);
  await tidy(page);
  await page.locator("#ed").evaluate((ed) => {
    const i = ed.value.indexOf("view '");
    ed.focus();
    ed.setSelectionRange(i, i);
    ed.blur();
  });
  await shot(page, "saved-view");

  // 書き出し（draw.io）
  await page.locator("#fileMenu summary").click();
  await settle(page, 300);
  await shot(page, "file-menu", { clip: await boxOf(page, "#fileMenu .pop", 8) });
  // メニューバー（「図」のメニューを開いたところ）
  await page.locator("#diagramMenu summary").hover();
  await settle(page, 300);
  {
    const bar = await boxOf(page, "header");
    const pop = await boxOf(page, "#diagramMenu .pop", 8);
    await shot(page, "menubar", { clip: { x: 0, y: 0, width: 760, height: pop.y + pop.height - bar.y } });
  }
  await page.locator("#fileMenu summary").hover();
  await settle(page, 300);
  await page.locator("#btnDrawio").click();
  await settle(page, 300);
  await shot(page, "export-drawio", { clip: await boxOf(page, "#modal .box", 8) });
  await page.locator("#modalClose").click();

  // 問題一覧（書き間違い）と語の説明
  await showView(page, "structure");
  const text = await page.locator("#ed").inputValue();
  await page.locator("#ed").fill(text.replace("part motor : SuctionMotor;", "part motor : SuctionMoter;").replace("connect battery.pwr to controller.pwr;", "connect battery.pwr to controller.pwr"));
  await settle(page, 1200);
  await tidy(page);
  await shot(page, "problems", { clip: await boxOf(page, ".textpane") });
  await page.locator("#ed").fill(text);
  await settle(page, 1000);

  await page.locator("#ed").evaluate((ed) => (ed.scrollTop = 0));
  const hl = await page.evaluate(() => {
    const ed = document.querySelector("#ed");
    const i = ed.value.indexOf("requirement def");
    ed.focus();
    ed.setSelectionRange(i + 3, i + 3);
    ed.dispatchEvent(new Event("select"));
    return i;
  });
  if (hl >= 0) {
    const span = page.locator('#hl span:text-is("requirement")').first();
    const b = await span.boundingBox();
    await page.mouse.move(b.x + 10, b.y + b.height / 2);
    await page.mouse.move(b.x + 14, b.y + b.height / 2);
    await page.locator("#wordTip").waitFor({ state: "visible" });
    await shot(page, "word-help", { clip: await boxOf(page, ".textpane") });
  }
  await page.context().close();
}

/** トレーサビリティ・フェーズ・制御ループ（コーヒーメーカー）。 */
async function coffeeShots(browser) {
  const page = await openApp(browser);
  await closeSample(page);
  await openFolder(page);
  await openFile(page, "coffee-machine.sysml");
  await showView(page, "trace");
  await zoom(page, 0);
  await clickNode(page, "Machine");
  await tidy(page);
  await badge(page, [
    ["header .sync", 1, "r"],
    ["#menubar", 2, "r"],
    ["#explorer", 3, "tr"],
    ["#tabbar", 4, "tl"],
    ["#palette", 5, "tr"],
    ["#subbar", 6, "l"],
    ["#wrap", 7, "c"],
    ["#insp", 8, "tr"],
    ["#mini", 9, "tr"],
    [".textpane .editor", 10, "c"],
    ["#problems", 11, "tr"],
  ]);
  await shot(page, "screen-map");
  await unbadge(page);
  await page.keyboard.press("Escape");
  await hideMinimap(page);
  await toggleTree(page);
  await zoom(page, 0);
  await shot(page, "diagram-traceability");
  await page.locator("#phaseFilter").selectOption({ value: "SystemRequirements" });
  await settle(page);
  await zoom(page, 0);
  await shot(page, "diagram-traceability-phase");
  await showView(page, "control");
  await zoom(page, 0);
  await shot(page, "diagram-control-loop");
  await page.context().close();
}

/** 「すべて」の図を開き、ほかのタブと全体図を閉じる。 */
async function showAll(page) {
  await showView(page, "all");
  await hideMinimap(page);
}

/**
 * パレットの道具で、図の枠の中の位置に要素を置き、名前を付ける。
 *
 * @param kind 道具（"part def" など）
 * @param x 図の枠の左からの位置（px）
 * @param y 図の枠の上からの位置（px）
 * @param name 付ける名前
 * @param before 名前を確定する前に撮る画像の名前（省略可）
 */
async function placeAndName(page, kind, x, y, name, before) {
  const wrap = await page.locator("#wrap").boundingBox();
  await page.locator(`#palette [data-tool="${kind}"]`).click();
  await page.mouse.click(wrap.x + x, wrap.y + y);
  await settle(page);
  if (await page.locator("#dialog").isVisible()) {
    await page.locator("#dialog input").first().fill("BicycleLight");
    await shot(page, "tutorial-2-package");
    await page.locator('#dialogButtons button:has-text("作成して配置")').click();
    await settle(page, 1000);
  }
  await page.locator("#renameIn").fill(name);
  await page.locator("#renameIn").press("Enter");
  await settle(page);
  if (before) {
    await waitToast(page);
    await shot(page, before);
  }
}

/** 2 つの要素の間に、図の操作で関係を足す。shotName を渡すと、関係を選ぶところを撮る。 */
async function connectNodes(page, from, to, rel, shotName) {
  await clickNode(page, from);
  await page.locator('#insp [data-act="connect"]').click();
  await settle(page, 300);
  await clickNode(page, to);
  if (shotName) await waitToast(page);
  if (shotName) await shot(page, shotName, { clip: await boxOf(page, ".diagrampane") });
  await page.locator(`#insp [data-rel="${rel}"]`).click();
  await settle(page, 1000);
}

/** はじめての図（自転車のライト）。図の操作だけで作る。 */
async function tutorialShots(browser) {
  const page = await openApp(browser, { folder: "my-models", files: {} });
  await closeSample(page);
  await page.locator('#noDoc [data-nodoc="new"]').click();
  await settle(page);
  await showAll(page);
  await tidy(page);
  await shot(page, "tutorial-1-new-file");

  await placeAndName(page, "requirement def", 330, 60, "BrightEnough");
  await waitToast(page);
  await clickNode(page, "BrightEnough");
  await tidy(page);
  await shot(page, "tutorial-3-requirement");
  await placeAndName(page, "part def", 330, 230, "Light");
  await placeAndName(page, "part def", 150, 400, "Battery");
  await placeAndName(page, "part def", 500, 400, "Led");
  await connectNodes(page, "Light", "Battery", "comp", "tutorial-4-parts");
  await connectNodes(page, "Light", "Led", "comp");
  await connectNodes(page, "Light", "BrightEnough", "satisfy");
  await page.mouse.move(2, 400);
  await shot(page, "tutorial-5-satisfy");

  // 内部ブロック図で、battery から led へ流れを引く
  await waitToast(page);
  await page.evaluate(() => (document.querySelector(".tabadd").open = true));
  await page.locator('.tabadd [data-open="ibd"]').click();
  await settle(page);
  await hideMinimap(page);
  const bb = await page.locator('#gNodes [data-key="u:battery"]').first().boundingBox();
  await page.mouse.click(bb.x + bb.width / 2, bb.y + 12, { button: "right" });
  await settle(page, 300);
  await page.locator("#ctx >> text=関係を追加…").click();
  await settle(page, 300);
  await clickNode(page, "u:led");
  await page.locator('#insp [data-rel="flow"]').click();
  await settle(page, 1000);
  await zoom(page, 0);
  await waitToast(page);
  await tidy(page);
  await shot(page, "tutorial-6-ibd");

  await page.keyboard.press("Control+s");
  await page.locator("#dialog").waitFor();
  await page.locator("#dialog input").first().fill("bicycle-light.sysml");
  await shot(page, "tutorial-7-save");
  await page.locator('#dialogButtons button:has-text("保存")').click();
  await settle(page, 1000);
  await waitToast(page);
  await shot(page, "tutorial-8-saved", { clip: { ...(await boxOf(page, ".treepane")), height: 240 } });
  await page.context().close();
}

/** テキストで書く・行き来する（自転車のライト）。 */
async function textShots(browser) {
  const page = await openApp(browser, { folder: "my-models", files: {} });
  await closeSample(page);
  await page.locator('#noDoc [data-nodoc="new"]').click();
  await settle(page);
  await showAll(page);
  await page.locator("#ed").fill(examples["bicycle-light.sysml"]);
  await settle(page, 1200);
  await zoom(page, 1);
  await tidy(page);
  await shot(page, "text-1-written");

  // トレーサビリティで、検証を置いて要求につなぐ
  await showView(page, "trace");
  await hideMinimap(page);
  await zoom(page, 0);
  await placeAndName(page, "verification def", 420, 80, "BrightnessTest");
  await waitToast(page);
  await connectNodes(page, "BrightnessTest", "BrightEnough", "verify");
  await zoom(page, 0);
  await page.mouse.move(2, 400);
  await shot(page, "text-2-from-diagram");
  console.log(await page.locator("#ed").inputValue());
  await page.context().close();
}

/** スマホの画面（幅 390px）。 */
async function phoneShots(browser) {
  const page = await openApp(browser, { viewport: PHONE, scale: 2 });
  await page.locator("#tabTree").click();
  await page.locator("#sideFiles").click();
  await closeSample(page);
  if (await page.locator('#noDoc [data-nodoc="openFolder"]').isVisible()) await openFolder(page);
  else {
    await page.locator("#tabTree").click();
    await openFolder(page);
  }
  await openFile(page, "robot-vacuum.sysml");
  await page.locator("#tabDiagram").click();
  await showView(page, "seq");
  await hideMinimap(page);
  await zoom(page, 0);
  await tidy(page);
  await shot(page, "phone-diagram");
  await page.evaluate(() => (document.querySelector(".tabadd").open = true));
  await settle(page, 300);
  await shot(page, "phone-plus-menu");
  await tidy(page);
  await page.locator("#tabText").click();
  await settle(page, 500);
  await shot(page, "phone-text");
  await page.locator("#menuToggle").click();
  await settle(page, 300);
  await page.locator("#fileMenu summary").click();
  await settle(page, 300);
  await shot(page, "phone-menu");
  await page.context().close();
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
try {
  if (want("desktop")) await desktopShots(browser, "light");
  if (want("dark")) await desktopShots(browser, "dark");
  if (want("coffee")) await coffeeShots(browser);
  if (want("tutorial")) await tutorialShots(browser);
  if (want("text")) await textShots(browser);
  if (want("phone")) await phoneShots(browser);
} finally {
  await browser.close();
}
