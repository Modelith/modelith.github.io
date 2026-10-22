# 状態遷移図

状態定義の中の **状態** と、状態の間の **遷移** を描く図です。SysML v2 では StateTransitionView です。

![ロボット掃除機の状態遷移図。idle → cleaning → charging → idle](/images/diagram-state-machine.jpg)

## 開く

状態遷移図は、＋メニューには出ません。次のどちらかで開きます。

- **モデルのツリーから** — 状態定義の行の「開く」（右クリックでは「状態遷移図で開く」）を押します。タブには `stm VacuumStates` のように出ます。サブバーの「状態定義」で、ほかの状態定義に切り替えられます。
- **作成した図から** — 状態遷移図を表示して「新しい図を作成」を押すと、＋メニューの「作成した図」からいつでも開けるようになります（[新しい図を作成する](/diagrams/create-diagram)）。テキストで書くときは、次のような `view` を書きます。

```sysml
view VacuumStateView : StateTransitionView {
    expose VacuumStates;
}
```

## 図に出るもの

| 記号 | 意味 | テキストの例 |
| --- | --- | --- |
| 角の丸い四角 | 状態 | `state idle;` |
| 状態の中の区画 | 入るとき・その間・出るときの振る舞い（`entry / startBrush` の形） | `entry action startBrush;`・`do …`・`exit action stopBrush;` |
| 状態の中の状態 | 入れ子の状態 | `state on { state low; state high; }` |
| 破線で区切った領域 | 並行の状態 | `state def S parallel { … }`・`state s parallel { … }` |
| 塗った丸からの矢印 | 最初の遷移 | `entry; then idle;` |
| 丸の中の塗った丸 | 終了 | `… then done;` |
| 矢印とラベル `きっかけ [条件] / 動作` | 遷移 | `transition first idle accept StartCommand if charged do beep then cleaning;` |

## 図で操作する

- 2 つの状態の間に線を引くと（状態を選んで「遷移を追加」、または縁の「＋」からドラッグ）、「この状態から遷移する（transition）」を選べます。テキストに `transition first a then b;` が足されます。
- 遷移を選んで削除すると、その文が消えます。
- 状態を選んで「名前を変更」・「削除」ができます。
- 名前の無い状態は、図からは遷移でつなげません。

## テキストで書く

状態と、遷移のきっかけ（`accept`）・条件（`if`）・動作（`do`）、入るとき・出るときの振る舞いは、**図からは書けません。テキストで書きます**（パレットに要素の道具は出ません）。
上の図は、次のテキストから描いています。状態定義そのものは、[振る舞い](/diagrams/behavior) などの図のパレットで置けます。

```sysml
state def VacuumStates {
    entry; then idle;
    state idle;
    state cleaning {
        entry action startBrush;
        exit action stopBrush;
    }
    state charging;
    transition first idle accept StartCommand then cleaning;
    transition first cleaning accept LowBattery then charging;
    transition first charging accept Charged then idle;
}
```

図で引いた遷移に、きっかけを書き足すときは、`transition first idle then cleaning;` を `transition first idle accept StartCommand then cleaning;` のように書き換えます。

状態の中で、遷移を短く書くこともできます（直前の状態からの遷移になります）。

```sysml
state idle;
    accept StartCommand then cleaning;
```

## できないこと（0.1.0-rc.1）

- `view` に状態定義を複数書いても、最初の 1 つだけを描きます。
- 状態の使用（`exhibit state s { … }`）の中の遷移は描きません。
- 遷移の動作の中身、線の交差を避ける配置は扱いません。

::: tip 例のモデル
この図のモデルは <a href="/examples/robot-vacuum.sysml" download>robot-vacuum.sysml</a> です。
:::
