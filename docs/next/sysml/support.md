---
aside: false
---

# 対応している書き方

Modelith は、SysML v2 のテキストの書き方のうち、よく使う部分から対応しています。
まだ読めない書き方は、ふつうは問題一覧に「まだ扱えない」と知らせますが、一部は知らせずに読み飛ばします。

この表は **0.2.0-alpha.4** 時点の要約です（2026-10-20 に [SysML v2 の規格](https://github.com/Systems-Modeling/SysML-v2-Release) と照合し、その後に対応した書き方を足しています）。書き方ごとの詳しい状況は、modelith リポジトリの [SysML v2 仕様との対応表](https://github.com/modelith/modelith/blob/dev/docs/reference/sysml-conformance.md) を見てください。

## まとめ

対応表では、規格の文法（BNF）にあるテキストの書き方 **119 項目** を調べています。

| 状況 | 項目の数 | 意味 |
| --- | --- | --- |
| 対応 | 101 | モデルに読み込み、ツリーや図（要素の情報はインスペクタ）に出ます |
| 一部対応 | 13 | 一部だけ読み込みます。または、書いても中身を使いません |
| 未対応 | 5 | 読み込みません（エラーにせずに読み飛ばすものを含みます） |

::: info 仕様への適合について
Modelith は SysML v2 と KerML の仕様をもとに作っていますが、仕様への適合（conformance）はうたっていません。
「テキストの書き方の主要な部分を読み書きし、図にするエディタ」という位置づけです。
:::

## 書き方の分類ごとの状況

| 分類 | 書き方 | 状況 | 足りないところ | 予定 |
| --- | --- | :---: | --- | --- |
| パッケージ | `package`（入れ子を含む）、`library package` | 対応 | ライブラリの印は記録しない | — |
| | `import`（`::*`・`::**` を含む）、可視性 `private`・`public` | 一部対応 | フォルダを開いているときは、ほかのファイルのパッケージからも取り込める。絞り込み付きの取り込み `import P::*[@F]` とパッケージの直下の `filter` は使えない。`import all` を区別しない。標準ライブラリは同梱していないので取り込めない | 0.2.0 |
| 名前 | 引用名 `'Fuel Tank'`・短い名前 `<R1>`・修飾名 `A::B` | 対応 | フォルダを開いているときは、ほかのファイルの名前も解決する（[複数のファイル](/next/guide/files#複数のファイル)） | |
| | `alias` | 一部対応 | ほかのファイルの別名は解決しない | 0.2.0 |
| 構造 | `part`・`item`・`attribute`・`port`・`enum`・`occurrence` の定義と使用、`event occurrence`・`timeslice`・`snapshot`・`individual` | 対応 | | |
| | 型付け `:`・特殊化 `:>`・再定義 `:>>`・参照 `::>`・多重度 `[0..4]`・値 `=`・`:=`・`default`・向き `in`・`out` | 対応 | `: A, B` は先頭の型だけ | — |
| | キーワードの無い特性 `x : Real;`・`ref r;`・交差 `=>`・`crosses`・共役ポート `~Pt` | 対応 | | |
| つながり | `connection`・`connect`（3 つ以上をつなぐ形を含む）・`interface`（`connect` を省いた形を含む）・`bind`・`allocate`・`dependency` | 対応 | | |
| | `flow`・`flow def`・`message`・`succession flow`（`from` を省いた短い形を含む） | 対応 | | |
| 振る舞い | `action`・順序 `first … then`・`fork`・`join`・`merge`・`decide`・`send`・`accept`・`assign`・`terminate`・`if`・`while`・`for` | 対応 | | |
| | `state`・遷移 `transition`（きっかけ・条件・動作と省略形）・`entry`・`do`・`exit`・`parallel` | 対応 | 状態の使用の中の遷移を図に描かない | 0.3.0 以降 |
| | `perform`・`exhibit`（既存の要素を指す `perform x.y;`・`exhibit s;` を含む）、`calc`・`constraint` | 対応 | | |
| 要求と検証 | `requirement`・`subject`・`stakeholder`・`actor`・`concern`・`case`・`analysis`・`verification`・`use case`・`#derivation dependency` | 対応 | | |
| | `satisfy`（`by` の無い形・宣言する形を含む）・`frame` | 対応 | | |
| | `verify`（型の無い検証の使用の中を含む）・`objective`・`assume`・`require`・`assert constraint`・`assert not` | 対応 | | |
| ビュー | `view`・`view def`・`expose`・`filter`（`and`・`or`・`not` などの式）・`render` | 一部対応 | メタデータの値を比べる `filter`、表や文字の形の `render` は使えない | 0.3.0 以降 |
| 注釈 | `doc`・`comment … about`（メモ）・`rep`・`metadata def`・`#M`・`metadata … about`・自分で決めたキーワード | 対応 | 関係（`dependency`・`alias`）の本体の `doc` は記録しない | — |
| 式 | 式・単位 `1500 [kg]`・`->collect{ … }` | 一部対応 | 文字列として持つだけで、計算しない | 0.3.0 以降 |
| その他 | KerML、標準ライブラリ、モデル交換の形式（`.kpar`） | 未対応 | KerML の宣言は「まだ扱えない」と知らせる | 0.3.0 以降 |

## 図（標準のビュー）の状況

| 図の種類（SysML v2 の標準ビュー） | 状況 | 足りないところ | 予定 |
| --- | :---: | --- | --- |
| ブロック定義図・一般の図（GeneralView） | 一部対応 | パッケージの直下の `use case` の使用と `case def` を描かない。ユースケースの楕円・アクターの記号が無い | 0.3.0 以降 |
| 内部ブロック図（InterconnectionView） | 一部対応 | 枠の上のポート（対象そのもののポート）へ、図から新しく線を引く操作が無い | 0.3.0 以降 |
| アクティビティ図（ActionFlowView） | 対応 | パラメータの向きや宣言は、テキストで書き換える | — |
| 状態遷移図（StateTransitionView） | 一部対応 | 状態の使用の中の遷移と、2 つ目以降の状態定義を描かない | 0.3.0 以降 |
| シーケンス図（SequenceView） | 一部対応 | 分岐や繰り返しの枠（`alt`・`loop`）が無く、図からイベントや順序を足せない | 0.3.0 以降 |
| ジオメトリ・グリッド・ブラウザ（GeometryView・GridView・BrowserView） | 未対応 | 一般の図で代わりに描き、そのことを知らせる | 0.3.0 以降 |

## まだ使えない仕組み

| 仕組み | 予定 |
| --- | --- |
| 絞り込み付きの取り込み（`import P::*[@F]`）と、ほかのファイルの別名（`alias`） | 0.2.0 |
| 式の計算と単位、ビューの `filter` でメタデータの値を比べる式（`level > 1` など） | 0.3.0 以降 |
| KerML の文法、標準ライブラリの同梱 | 0.3.0 以降 |
| 表や文字の形の図（`asTextualNotation`・`asElementTable`） | 0.3.0 以降 |
| モデル交換の形式（`.kpar`） | 0.3.0 以降 |

予定は、利用者の声に合わせて入れ替えることがあります。必要な書き方があれば、[GitHub Issues](https://github.com/modelith/modelith/issues/new/choose) でお知らせください。
これまでに対応した書き方は [リリースノート](/releases/) に、この先の予定は [ロードマップ](/roadmap) にあります。
