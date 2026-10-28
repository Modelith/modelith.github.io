# 振る舞い

モデルの中の振る舞い（状態定義・アクション定義・シナリオ）を一覧する図です。中身は箱の中に文字で並べます。
流れや遷移を線で見るときは、[アクティビティ図](/next/diagrams/activity)・[状態遷移図](/next/diagrams/state-machine)・[シーケンス図](/next/diagrams/sequence) を使います。
SysML v2 では GeneralView で描く図に当たります。

![ロボット掃除機の振る舞い。CleanRoom の手順、VacuumStates の状態と遷移、StartFromApp](/images/diagram-behavior.jpg)

## 図に出るもの

| 要素 | 箱の中身 |
| --- | --- |
| アクション定義（`action def`） | 中のアクションを、番号付きの手順として並べます（`1. leaveDock` など） |
| 状態定義（`state def`） | 状態の一覧と、遷移を「元 → 先 [きっかけ]」の形で並べます |
| シナリオ（`occurrence def`） | 名前 |
| これらを持つ要素 | 振る舞いを部品として持つ要素も表示し、実線でつなぎます |

## 図で操作する

- パレットの「状態定義」・「アクション定義」・「シナリオ」で要素を置けます。名前を変える・削除するのも図でできます。
- シナリオの中身（ライフラインとメッセージ）は、[シーケンス図](/next/diagrams/sequence#図で操作する) で図の操作だけで足せます。
- 箱をモデルのツリーから開くと、それぞれの図（アクティビティ図・状態遷移図・シーケンス図）に移ります。

## テキストで書く

アクション定義の中のアクションと、状態定義の中の状態は、**図からは足せません。テキストで書きます。** 書き方は [アクティビティ図](/next/diagrams/activity#テキストで書く) と [状態遷移図](/next/diagrams/state-machine#テキストで書く) を見てください。

```sysml
action def CleanRoom {
    first start;
    then action leaveDock;
    then action sweep;
}
state def VacuumStates {
    entry; then idle;
    state idle;
    state cleaning;
}
```

::: tip 例のモデル
この図のモデルは <a href="/examples/robot-vacuum.sysml" download>robot-vacuum.sysml</a> です。
:::
