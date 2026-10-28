# 図の種類と開き方

Modelith は、同じモデルを目的に合わせた図で表示します。
どの図も、**図の上で要素を置いたり線を引いたりして作れます**。テキストで書いたモデルも、そのまま図に描かれます。図で操作するとテキストが書き換わり、テキストを書き換えると図が変わります。

各図のページでは、「図で操作する」と「テキストで書く」を並べて説明します。図に道具の無いもの（アクティビティ図のアクション、状態遷移図の状態など）は、その旨をページに書き、テキストの例を示します。

## 図の一覧

| 図 | 何を見るか | SysML v2 では |
| --- | --- | --- |
| [トレーサビリティ](/next/diagrams/traceability) | 関心事・要求・検証と、要求を満たす要素のつながり | GeneralView で描く図 |
| [ブロック定義図](/next/diagrams/block-definition) | 部品定義と、部品として持つ・特殊化などの関係 | GeneralView で描く図 |
| [制御ループ](/next/diagrams/control-loop) | 制約・計算と、流れでつながる部品 | GeneralView で描く図（Modelith 独自） |
| [内部ブロック図](/next/diagrams/internal-block) | 1 つの部品定義の中の部品と、ポート・接続 | InterconnectionView |
| [振る舞い](/next/diagrams/behavior) | 状態定義・アクション定義・シナリオの一覧 | GeneralView で描く図 |
| [シーケンス図](/next/diagrams/sequence) | シナリオの中の部品の間のメッセージ | SequenceView |
| [アクティビティ図](/next/diagrams/activity) | アクション定義の中の流れ | ActionFlowView |
| [状態遷移図](/next/diagrams/state-machine) | 状態定義の中の状態と遷移 | StateTransitionView |
| [すべて](/next/diagrams/all) | モデルのすべての要素と関係 | GeneralView で描く図 |
| [作成した図](/next/diagrams/create-diagram) | 「新しい図を作成」で作った、自分で選んだ要素だけの図（テキストの `view`） | ビューの種類による |

状態遷移図だけは、＋メニューには出ません。モデルのツリーの状態定義から開きます。

## 図を開く

### ＋メニューから

図のタブの右の「＋」を押すと、「自動で描く図」の見出しの下に組み込みの 8 つの図が、「作成した図」の見出しの下に自分で作成した図が並びます。選ぶと新しいタブで開きます。
項目にマウスを乗せると、SysML v2 の標準のビューの名前（「SysML v2 では ActionFlowView」など）が出ます。

![＋メニュー](/images/next/plus-menu.jpg)

### モデルのツリーから

モデルのツリーの行にマウスを乗せると「開く」が出ます。押すと、その要素に合った図を開きます（行のダブルクリック・右クリックの「〜で開く」でも開きます）。

| 要素 | 開く図 |
| --- | --- |
| 部品を持つ部品定義 | 内部ブロック図 |
| 部品定義（部品を持たない）・属性定義 | ブロック定義図 |
| 要求・関心事・検証・解析 | トレーサビリティ |
| 制約定義・計算定義 | 制御ループ |
| アクション定義 | アクティビティ図 |
| 状態定義 | 状態遷移図 |
| シナリオ（`occurrence def`） | シーケンス図 |
| 作成した図（`view`） | その図 |

## タブ

開いた図はタブに並びます。タブの名前は、図の種類と対象を表します。

| タブの名前 | 図 |
| --- | --- |
| `ibd Vacuum` | 部品定義 Vacuum の内部ブロック図 |
| `sd StartFromApp` | シナリオ StartFromApp のシーケンス図 |
| `act CleanRoom` | アクション定義 CleanRoom のアクティビティ図 |
| `stm VacuumStates` | 状態定義 VacuumStates の状態遷移図 |
| `トレーサビリティ：システム要求` | フェーズを「システム要求」に絞り込んだトレーサビリティ |

開いているタブと表示位置は、このブラウザに記憶されます。

## 図に共通の操作

- 要素を選ぶ・動かす・関係を足す・消す、右クリックのメニュー、整列、線の形、全体図、SVG 画像・draw.io のファイルへのエクスポートは、[図の操作とエクスポート](/next/diagrams/editing) にまとめています。図に道具の無いものの一覧も、同じページにあります。
- このマニュアルの図の例は、ロボット掃除機（<a href="/examples/robot-vacuum.sysml" download>robot-vacuum.sysml</a>）とコーヒーメーカー（<a href="/examples/coffee-machine.sysml" download>coffee-machine.sysml</a>）のモデルです。ダウンロードして、Modelith で開いて試せます。
