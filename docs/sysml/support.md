---
aside: false
---

# 対応している書き方

Modelith は、SysML v2 のテキストの書き方のうち、よく使う部分から対応しています。
まだ読めない書き方は、エラーにせず、問題一覧に「まだ扱えない」と知らせます（一部は知らせずに読み飛ばします）。

この表は **0.1.0-alpha.9** 時点の要約です。書き方ごとの詳しい状況は、modelith リポジトリの [SysML v2 仕様との対応表](https://github.com/modelith/modelith/blob/dev/docs/reference/sysml-conformance.md) を見てください。

## まとめ

対応表では、テキストの書き方 **96 項目** を調べています。

| 状況 | 項目の数 | 意味 |
| --- | --- | --- |
| ✅ 使える | 82 | モデルに取り込み、ツリーや図（要素の情報はインスペクタ）に出ます |
| 🟡 一部だけ使える | 10 | 一部だけ取り込みます。または、書いても中身を使いません |
| ❌ まだ使えない | 4 | 取り込みません（エラーにせずに読み飛ばすものを含みます） |

正しい書き方を、別の意味に取り違えて誤った表示をする項目は 0 件です。

::: info 仕様への適合について
Modelith は SysML v2 と KerML の仕様をもとに作っていますが、仕様への適合（conformance）はうたっていません。
「テキストの書き方の主要な部分を読み書きし、図にするエディタ」という位置づけです。
:::

## 書き方の分類ごとの状況

| 書き方の分類 | 状況 | 足りないところ | 予定 |
| --- | :---: | --- | --- |
| 名前とコメント（基本の名前・引用名 `'Fuel Tank'`・短い名前 `<R1>`・コメント・文字列） | ✅ | | |
| 修飾名 `A::B` | 🟡 | 同じファイルの中だけ。`import` を通した名前と、ほかのファイルの名前は解決しない | 0.2.0 |
| 依存と注釈（`dependency`・`#derivation dependency`・`doc`・`comment … about`・`rep`） | ✅ | | |
| パッケージ（`package`・入れ子・`library package`） | ✅ | | |
| `import` | ❌ | 読み飛ばす。ほかのファイルは読まない | 0.2.0 |
| `alias` | 🟡 | 同じファイルの中だけ | 0.2.0 |
| 可視性（`private`・`public`・`protected`） | 🟡 | 記録するだけ | 0.2.0 |
| パッケージの直下の `filter` | ❌ | 読み飛ばす | 0.2.0 |
| 定義と使用（型付け `:`・特殊化 `:>`・部分集合・再定義 `:>>`・参照 `::>`・多重度・値 `=`・`:=`・`default`・向き `in`・`out`） | ✅ | | |
| 属性・列挙・出来事・アイテム・部品・ポート（`attribute`・`enum`・`occurrence`・`item`・`part`・`port` の定義と使用） | ✅ | | |
| 接続と流れ（`connection`・`connect`・3 つ以上をつなぐ `connect`・`bind`・`interface`・`allocation`・`allocate`・`flow`・`succession flow`・`message`） | ✅ | | |
| アクション（`action`・`perform action`・順序 `first … then`・`fork`・`join`・`merge`・`decide`・`send`・`accept`・`assign`・`terminate`・`if`・`while`・`for`） | ✅ | | |
| 状態（`state`・`exhibit state`・`parallel`・`entry`・`do`・`exit`・`transition` とその省略形） | ✅ | | |
| 計算・制約（`calc`・`constraint`・`require`・`assume`） | ✅ | | |
| `assert constraint`・`assert not constraint` | 🟡 | 式として残すだけ。否定（`not`）を記録しない形がある | 0.3.0 以降 |
| 要求とケース（`requirement`・`subject`・`stakeholder`・`actor`・`satisfy`・`concern`・`frame`・`case`・`analysis`・`verification`・`use case`・`include use case`） | ✅ | | |
| `objective` | 🟡 | 中身は外側の要素に入れる（目的の要求そのものは要素にしない） | |
| `verify` | 🟡 | 型の無い検証の使用の中では線を引かない | |
| ビュー（`view def`・`view`・ビューの中の `filter`・`render rendering …`・`viewpoint`・`rendering`） | ✅ | | |
| `expose` | 🟡 | `import` を通した名前は解決しない | 0.2.0 |
| `render asTreeDiagram` など（参照の形） | 🟡 | `asTextualNotation`・`asElementTable` に当たる描き方が無い | 0.3.0 以降 |
| メタデータ（`metadata def`・`@M`・`metadata … about`・前置の `#M`・自分で決めたキーワード `#X def`） | ✅ | | |
| 特徴量の連鎖 `a.b.c.p` | ✅ | | |
| 式と単位 `1500 [kg]` | 🟡 | 文字列として持つだけで、計算しない | 0.3.0 以降 |
| KerML のキーワード（`classifier`・`feature`・`function` など） | ❌ | 読み飛ばす。`.kerml` のファイルは開けるが、中身は読めない | 0.3.0 以降 |
| まだ扱えない文 | 🟡 | キーワードで始まり、どの読み方にも当たらない文は「まだ扱えない」と知らせる | — |

## 図（標準のビュー）の状況

| 標準のビュー | 画面での名前 | 状況 | 足りないところ | 予定 |
| --- | --- | :---: | --- | --- |
| GeneralView | 一般ビュー（ブロック定義図・トレーサビリティなど） | 🟡 | 定義の中の特性どうしの線、`rep`・`doc` の記号 | — |
| InterconnectionView | 内部ブロック図 | 🟡 | 対象そのもののポートへの線、入れ子の部品のポートを作る操作 | — |
| ActionFlowView | アクティビティ図 | 🟡 | アクションのパラメータとその間のフロー、入れ子の流れ、区画（スイムレーン） | 0.3.0 以降 |
| StateTransitionView | 状態遷移図 | 🟡 | 状態の使用の中の遷移、複数の状態定義、線の交差を避ける配置 | 0.3.0 以降 |
| SequenceView | シーケンス図 | 🟡 | 分岐や繰り返しの枠（`alt`・`loop`）、入れ子のシーケンス図、図からイベントや順序を足す操作 | 0.3.0 以降 |
| GeometryView・GridView・BrowserView | ジオメトリビュー・グリッドビュー・ブラウザビュー | ❌ | ノードと線の図で代わりに描き、そのことを知らせる | 0.3.0 以降 |

## まだ使えない仕組み

| 仕組み | 予定 |
| --- | --- |
| `import` と、ファイルをまたぐモデル | 0.2.0 |
| 式の計算と単位、ビューの `filter` でメタデータの値を比べる式（`level > 1` など） | 0.3.0 以降 |
| KerML の文法、標準ライブラリの同梱 | 0.3.0 以降 |
| 表や文字の形の図（`asTextualNotation`・`asElementTable`） | 0.3.0 以降 |
| モデル交換の形式（`.kpar`） | 0.3.0 以降 |

予定は、利用者の声に合わせて入れ替えることがあります。必要な書き方があれば、[GitHub Issues](https://github.com/modelith/modelith/issues/new/choose) でお知らせください。
これまでに対応した書き方は [リリースノート](/releases/) に、この先の予定は [ロードマップ](/roadmap) にあります。
