# アクティビティ図

アクション定義の中の **流れ**（どのアクションの後に何をするか）を描く図です。SysML v2 では ActionFlowView です。

![ロボット掃除機の掃除の流れ。開始 → leaveDock → sweep → checkBattery の分岐 → goHome → 終了](/images/diagram-activity.jpg)

## 開く

- ＋メニューの「アクティビティ図」で開き、サブバーの「アクション定義」で対象を選びます。
- モデルのツリーのアクション定義の「開く」（「アクティビティ図で開く」）でも開けます。タブには `act CleanRoom` のように出ます。

文字が読める大きさで開きます。全体を見るときは、図の右上の「全体」を押します。

## 図に出るもの

| 記号 | 意味 | テキストの例 |
| --- | --- | --- |
| 塗った丸 | 開始 | `first start;` |
| 丸の中の塗った丸 | 終了 | `then done;`・`first goHome then done;` |
| 角の丸い四角 | アクション | `action sweep;`・`then action sweep;` |
| 実線の矢印 | 順序（この後に実行する） | `first a then b;`・`then b;` |
| 矢印のラベル `[条件]`・`[else]` | 条件付きの順序 | `if batteryLow then goHome;`・`else sweep;` |
| ひし形 | 分岐（条件）・合流（条件） | `decide d;`・`merge m;` |
| 太い棒 | 分岐（並行）・合流（並行） | `fork f;`・`join j;` |
| 右が尖った五角形 | 送信 | `send StartCommand to vacuum;` |
| 左がへこんだ五角形 | 受信 | `accept cmd : StartCommand;` |
| «assign»・«terminate» の四角 | 代入・打ち切り | `assign count := count + 1;`・`terminate;` |
| «if»・«while»・«for» の四角 | 条件付きの実行・繰り返し・要素ごとの繰り返し（条件と中のアクションの名前を書きます） | `if lowBattery { action beep; }` |
| 破線の矢印とアイテムのラベル | 順序付きの流れ | `succession flow …` |

アクションは、順序の向きに上から並べます。

## 図で操作する

- 2 つの要素の間に線を引くと（要素を選んで「順序の線を追加」、または縁の「＋」からドラッグ）、「この後に実行する（順序 succession）」を選べます。テキストに `first a then b;` が足されます。
- 線を選んで削除すると、その順序の文が消えます。
- アクションを選んで「名前を変更」・「削除」ができます。
- 名前の無い要素は、図からは線でつなげません。

## テキストで書く

アクション・開始・終了・分岐などの要素は、**図からは足せません。テキストで書きます**（パレットに要素の道具は出ません）。
上の図は、次のテキストから描いています。アクション定義そのものは、[振る舞い](/diagrams/behavior) などの図のパレットで置けます。

```sysml
action def CleanRoom {
    first start;
    then action leaveDock;
    then action sweep;
    then decide checkBattery;
        if batteryLow then goHome;
        else sweep;
    action goHome;
    first goHome then done;
}
```

::: tip `then` の書き方
`then b;` は、**直前に書いた要素** からの順序です。`first start;` の後に `then action a;`・`then action b;` と続けると、開始 → a → b の順になります。
:::

## できないこと（0.1.0-beta.4）

- アクションのパラメータと、その間のフローは描きません。
- 入れ子のアクションの中の流れ、区画（スイムレーン）は描きません。

::: tip 例のモデル
この図のモデルは <a href="/examples/robot-vacuum.sysml" download>robot-vacuum.sysml</a> です。
:::
