# ライセンスと商標

## Modelith 本体

Copyright (C) 2026 The Modelith Authors

Modelith 本体（[modelith/modelith](https://github.com/modelith/modelith)）は、**AGPL-3.0**（Modelith Plugin Exception 付き）で公開しています。

- 本ソフトウェアは **無保証** です。ライセンスの条件で、再配布・改変できます。
- **プラグイン例外**（[PLUGIN-EXCEPTION.md](https://github.com/modelith/modelith/blob/dev/PLUGIN-EXCEPTION.md)）：plugin-sdk が定義するインタフェースだけを通じて本体とやり取りするプラグインには、AGPL の義務が及びません。
- 画面の「ヘルプ」から、動いているバージョンのソースコード・ライセンス・同梱ソフトウェアのライセンス（フォント、Vite の実行時のコード、WebAssembly に組み込んだ Rust のクレートなど）を確かめられます。
- ライセンスの全文は [modelith の README のライセンスの節](https://github.com/modelith/modelith#license) と [LICENSE](https://github.com/modelith/modelith/blob/dev/LICENSE) をご覧ください。

| リポジトリ | 内容 | ライセンス |
| --- | --- | --- |
| [modelith](https://github.com/modelith/modelith) | エディタ本体 | AGPL-3.0 + Plugin Exception |
| [plugin-sdk](https://github.com/modelith/plugin-sdk) | プラグイン向けのインタフェース・型定義 | MIT |
| [modelith.github.io](https://github.com/modelith/modelith.github.io) | このサイト | MIT |

## このサイト

このサイトの文章・画像・例のモデルは、[MIT ライセンス](https://github.com/modelith/modelith.github.io/blob/main/LICENSE) で公開しています。

## ご注意

- 開発中のバージョンのため、操作方法や保存形式は予告なく変わることがあります。
- 本ソフトウェアは無保証です。
- フォルダを開いてファイルを直接保存できるのは、Chrome と Edge です。
- 保存先のないファイル（新規作成したファイルやサンプル）は、ブラウザ内に下書きとして一時的に残るだけです。必要なものは「名前を付けて保存」で保存してください。

## 商標

SysML® と OMG® は Object Management Group, Inc. の登録商標、KerML™ は同社の商標です。Modelith は OMG と関係がなく、その認定・推奨も受けていません。
Modelith は SysML v2 と KerML の仕様をもとにしていますが、仕様への適合はうたっていません（[対応している書き方](/sysml/support)）。

## 開発に参加する

不具合のご報告やご要望は、[GitHub Issues](https://github.com/modelith/modelith/issues/new/choose) にお寄せください。
コードで貢献するときは、[CONTRIBUTING.md](https://github.com/modelith/modelith/blob/dev/CONTRIBUTING.md)（貢献者ライセンス契約（CLA）を含む）を先にお読みください。
設計の判断は [ADR](https://github.com/modelith/modelith/tree/dev/docs/adr) にまとめています（ライセンスの判断は [ADR-0006](https://github.com/modelith/modelith/blob/dev/docs/adr/0006-licensing.md)）。
