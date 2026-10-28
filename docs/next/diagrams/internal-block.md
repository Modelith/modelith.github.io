# 内部ブロック図

1 つの部品定義の **中身** を見る図です。中の部品・ポート・部品の間の接続や流れを、部品定義の枠の中に描きます。
SysML v1 の内部ブロック図（ibd）に当たり、SysML v2 では InterconnectionView です。

![ロボット掃除機（Vacuum）の内部ブロック図。battery の電源ポートから motor と controller へ接続](/images/next/diagram-internal-block.jpg)

## 対象を選ぶ

内部ブロック図は、部品を持つ部品定義ごとに描きます。サブバーの「対象ブロック」で、どの部品定義の中を見るかを選びます。
モデルのツリーで部品定義の「開く」を押しても開けます。タブには `ibd Vacuum` のように対象の名前が出ます。

## 図に出るもの

| 要素・関係 | 描き方 | テキストの例 |
| --- | --- | --- |
| 対象の部品定義 | 外側の枠 | `part def Vacuum { … }` |
| 部品 | «part» の角の丸い四角（`名前 : 型`） | `part battery : Battery;` |
| 部品の中の部品 | 外の部品の中に描きます | `part def Battery { part cell : Cell; }` |
| ポート | 部品の縁の小さな四角と名前 | `part def Battery { port pwr : PowerPort; }` |
| 対象の部品定義そのもののポート | 外側の枠の辺の上の小さな四角と名前（入力は左・出力は右・双方向は下の辺） | `part def Vacuum { in port charge : PowerPort; }` |
| 型の無い部品のポート | 部品の本体に書いたポートを、部品の縁に描きます | `part sensor { out port data; }` |
| 接続 | 部品やポートの間の線 | `connect battery.pwr to motor.pwr;`・`connection c : C connect a.p to b.p;`・`interface …` |
| 3 つ以上をつなぐ接続 | 塗った点から各端への線 | `connect (a, b, c);` |
| 流れ | 矢印 | `flow from sensor to controller;`・`flow of Water from tank.out to pump.in;` |
| 結び付け（値を等しくする） | 「=」を添えた線 | `bind a.x = b.y;` |

`controller.board.relay.coil` のように深い部品を指す線も、中の部品までたどって描きます。たどれない名前は問題一覧で知らせます。

## 図で操作する

- **部品を置く** — パレットの「部品を置く…」で部品定義を選び、図の上をクリックすると、対象の部品定義に `part 名前 : 型;` が足されます。図の何も無いところを右クリックして「ここに部品を置く」から選ぶこともできます。
- **部品をつなぐ** — 部品を右クリックして「関係を追加…」を選ぶ（または縁の「＋」からドラッグする）と、相手の部品を選べます。「信号・物理量を流す（flow）」を押すと、`flow from a to b;` が足されます。
- **消す** — 部品や線を選んで Delete キー、または右クリックの「削除」「関係を削除」で消します。

## ポート

- ポートを右クリックすると、「向き：入力」・「向き：出力」・「向き：双方向」で向きを変えたり、「ポートを削除」で消したりできます。
- ポートはドラッグで、部品の縁に沿って動かせます（位置は図の配置に保存します）。
- ポートでない線の端（接続点）を右クリックして「ポートにする…」を選ぶと、名前と型を決めてポートにできます。テキストに `port` の宣言が足されます。部品の中の部品の接続点もポートにでき、つながっていた線の端は `a.x.i` のように部品をたどった形のまま書き換わります。

### 枠の上のポート

対象の部品定義そのもののポート（ブロックの外とのつなぎ口）は、外側の枠の辺の上に描き、そこへの線を引きます。入力（`in`）のポートは左の辺、出力（`out`）は右の辺、双方向（向きを書かないか `inout`）は下の辺に置きます。
枠の上のポートへの線も、ほかの線と同じく選んで消せます。新しく線を引くときは、テキストで書きます。

```sysml
part def Vacuum {
    in port charge : PowerPort;
    part battery : Battery;
    connect charge to battery.pwr;
}
```

## テキストで書く

次のものは、**図からは足したり変えたりできません。テキストで書きます。**

- 接続（`connect`）・3 つ以上をつなぐ接続・結び付け（`bind`）・物の流れ（`flow of Water …`）
- 部品の名前の変更（図では型の名前から自動で付きます）
- 部品の中の部品
- 枠の上のポート（対象の部品定義そのもののポート）と、そこへの線

```sysml
part def Vacuum {
    part battery : Battery;
    part motor : SuctionMotor;
    connect battery.pwr to motor.pwr;
}
part def Battery {
    port pwr : PowerPort;
    part cell : Cell;
}
```

## できないこと

- 枠の上のポートから、図で新しく線を引くことはできません（テキストで書きます）。

::: tip 例のモデル
この図のモデルは <a href="/examples/robot-vacuum.sysml" download>robot-vacuum.sysml</a> です。
:::
