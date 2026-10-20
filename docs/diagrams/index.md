# 図の種類と開き方

Modelith は、同じモデルを目的に合わせた図で表示します。図はテキストから自動で描くので、図を描き足す手間はかかりません。
図で要素や関係を足すと、テキストが書き換わります。

## 図の一覧

| 図 | 何を見るか | SysML v2 では |
| --- | --- | --- |
| [トレーサビリティ](/diagrams/traceability) | 関心事・要求・検証と、要求を満たす要素のつながり | GeneralView で描く図 |
| [ブロック定義図](/diagrams/block-definition) | 部品定義と、部品として持つ・特殊化などの関係 | GeneralView で描く図 |
| [制御ループ](/diagrams/control-loop) | 制約・計算と、流れでつながる部品 | GeneralView で描く図（Modelith 独自） |
| [内部ブロック図](/diagrams/internal-block) | 1 つの部品定義の中の部品と、ポート・接続 | InterconnectionView |
| [振る舞い](/diagrams/behavior) | 状態定義・アクション定義・シナリオの一覧 | GeneralView で描く図 |
| [シーケンス図](/diagrams/sequence) | シナリオの中の部品の間のメッセージ | SequenceView |
| [アクティビティ図](/diagrams/activity) | アクション定義の中の流れ | ActionFlowView |
| [状態遷移図](/diagrams/state-machine) | 状態定義の中の状態と遷移 | StateTransitionView |
| [すべて](/diagrams/all) | モデルのすべての要素と関係 | GeneralView で描く図 |
| [保存された図](/diagrams/saved-views) | 自分で選んだ要素だけの図（テキストの `view`） | 書いたビューの種類による |

状態遷移図だけは、＋メニューには出ません。モデルのツリーの状態定義から開きます。

## 図を開く

### ＋メニューから

図のタブの右の「＋」を押すと、組み込みの 8 つの図と、保存された図が並びます。選ぶと新しいタブで開きます。
項目にマウスを乗せると、SysML v2 の標準のビューの名前（「SysML v2 では ActionFlowView」など）が出ます。

![＋メニュー](/images/plus-menu.jpg)

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
| 保存された図（`view`） | その図 |

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

- 要素を選ぶ・動かす・関係を足す・消す、右クリックのメニュー、整列、線の形、全体図、SVG・draw.io への書き出しは、[図の操作と書き出し](/diagrams/editing) にまとめています。
- このマニュアルの図の例は、ロボット掃除機（<a href="/examples/robot-vacuum.sysml" download>robot-vacuum.sysml</a>）とコーヒーメーカー（<a href="/examples/coffee-machine.sysml" download>coffee-machine.sysml</a>）のモデルです。ダウンロードして、Modelith で開いて試せます。
