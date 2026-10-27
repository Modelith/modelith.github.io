# SysML v2 の書き方入門

SysML v2 のテキストのうち、よく使う書き方を、小さな例で紹介します。それぞれ、Modelith でどう見えるかも書きます。
例はそのまま Modelith のテキストに貼り付けて試せます。

::: tip 語の意味は画面でも確かめられます
Modelith のテキストで、キーワードにマウスを乗せると、その意味が出ます（スマホではダブルタップ）。→ [語の説明](/next/guide/screen#語の説明)
:::

## 基本の形

- 宣言は `キーワード 名前` の形で書き、`;` で終えるか、`{ … }` で中身を書きます。
- 大文字・小文字は区別します。名前には英字・数字・`_` を使い、空白や日本語を含む名前は `'…'` で囲みます（`'Fuel Tank'`）。
- `//` から行の終わりまでと、`/* … */` はコメントです。

| よく出る記号 | 意味 |
| --- | --- |
| `a : T` | a の型は T |
| `A :> B` | A は B を引き継ぐ（特殊化） |
| `[4]`・`[0..*]` | 多重度（いくつあるか） |
| `x = 3.7` | 値 |
| `a.p` | 部品 a のポート p（`.` で中の要素をたどる） |
| `P::A` | パッケージ P の中の A |

## パッケージ

```sysml
package Garden {
    package Sensors {
        part def MoistureSensor;
    }
    part def Sprinkler;
}
```

**パッケージ**（`package`）は、モデルの要素を入れる入れ物です。入れ子にできます。
ファイルの一番外側に 1 つ書き、その中に要素を書くのがふつうです。

**Modelith では** — モデルのツリーの一番上に出ます。図には出ません（[作成した図](/next/diagrams/create-diagram#パッケージを枠で囲む) で枠として描けます）。
パッケージの無いファイルで図から要素を置くと、パッケージを作るよう案内します。

## 部品定義と部品

```sysml
package Bicycle {
    part def Bike {
        part frontWheel : Wheel;
        part rearWheel : Wheel;
        part light : Light;
    }
    part def Wheel;
    part def Light;
}
```

- **部品定義**（`part def`）は、部品の **型** です。「自転車とはこういうもの」を定義します。
- **部品**（`part`）は、型を使った具体的な部品です。`part frontWheel : Wheel;` は「Wheel 型の frontWheel という部品を持つ」という意味です。

**Modelith では** — [ブロック定義図](/next/diagrams/block-definition) に «part def» の箱で出て、部品として持つ関係が `frontWheel` などのラベル付きの線になります。
部品を持つ部品定義は、[内部ブロック図](/next/diagrams/internal-block) で中身を見られます。

### 多重度と特殊化

```sysml
package Vehicles {
    part def Vehicle;
    part def Wheel;
    part def Car :> Vehicle {
        part wheels : Wheel[4];
    }
}
```

- `[4]` は多重度で、部品の数を表します。`[0..1]`（0 か 1）・`[1..*]`（1 つ以上）のようにも書けます。
- `Car :> Vehicle` は、Car が Vehicle を **引き継ぐ**（特殊化）という意味です。`specializes` とも書けます。

**Modelith では** — 多重度は線の端と箱の中の行に、特殊化は白抜きの三角の矢印で描きます。

## 属性

```sysml
package Kettle {
    attribute def Volume;
    part def Kettle {
        attribute capacity = 1.0;
        attribute maxTemperature default 100;
        attribute volume : Volume;
    }
}
```

- **属性**（`attribute`）は、部品が持つ値や性質です。`=` で値を、`default` で既定の値を書けます。
- **属性定義**（`attribute def`）は、属性の型です。

**Modelith では** — 部品定義の箱の中に `capacity = 1.0` のような行で出ます。値は書いたまま表示し、計算はしません（単位 `[kg]` なども文字列のまま扱います）。

## ポートと接続

```sysml
package Lamp {
    port def PowerPort;

    part def Battery {
        port powerOut : PowerPort;
    }
    part def Bulb {
        port powerIn : ~PowerPort;
    }
    part def Lamp {
        part battery : Battery;
        part bulb : Bulb;
        connect battery.powerOut to bulb.powerIn;
    }
}
```

- **ポート**（`port`）は、部品の出入り口です。型は **ポート定義**（`port def`）で決めます。`~` を付けると、向きを反対にした（共役の）ポートになります。
- **接続**（`connect a.p to b.q;`）で、部品のポートどうしをつなぎます。`connection`・`interface` を付けた書き方もあります。

**Modelith では** — [内部ブロック図](/next/diagrams/internal-block) で、部品の縁の小さな四角（ポート）と、その間の線で描きます。

### 流れ

```sysml
package Watering {
    item def Water;
    part def Tank;
    part def Pump;
    part def System {
        part tank : Tank;
        part pump : Pump;
        flow of Water from tank to pump;
    }
}
```

**流れ**（`flow`）は、部品の間を物や信号が流れることを表します。`of Water` で流れるもの（アイテム）を書けます。

**Modelith では** — 内部ブロック図で矢印になり、[制御ループ](/next/diagrams/control-loop) の図では部品の型の間の矢印になります。

## 要求・満たす・検証

```sysml
package Toaster {
    concern def EasyToUse {
        doc /* 朝の忙しい時間でも迷わず使いたい */
    }
    requirement def <'R1'> ToastTime {
        doc /* 2 分以内にパンを焼く */
        frame concern easy : EasyToUse;
    }
    part def Toaster;
    satisfy ToastTime by Toaster;

    verification def ToastTimeTest {
        objective { verify ToastTime; }
    }
}
```

| 書き方 | 意味 |
| --- | --- |
| `concern def` | 関心事。利用者などが気にかけていること |
| `requirement def` | 要求。満たすべき条件。`doc /* … */` に文章を書きます |
| `<'R1'>` | 短い名前（要求の番号などに使う） |
| `frame concern c : C;` | この要求が関心事 C を扱う |
| `satisfy R by A;` | 要素 A が要求 R を満たす |
| `verification def` と `verify R;` | 要求 R を確かめる検証 |
| `#derivation dependency from A to B;` | 要求 A を要求 B から導出した |

**Modelith では** — [トレーサビリティ](/next/diagrams/traceability) の図で、«satisfy»・«verify»・«frame»・«derive» の破線の矢印になります。
フェーズを付けると、つながりの抜けを問題一覧で知らせます。

## アクションと順序

```sysml
package CoffeeMaker {
    action def MakeCoffee {
        first start;
        then action grindBeans;
        then action heatWater;
        then action brew;
        then done;
    }
}
```

- **アクション定義**（`action def`）は、手順や処理のまとまりです。中に **アクション**（`action`）を書きます。
- **順序**（`first a then b;`）で、a の後に b を実行することを表します。`then b;` は直前の要素からの順序です。`start`・`done` は開始と終了です。
- 分岐は `decide d;` と `if 条件 then a;`・`else b;`、並行の分岐・合流は `fork`・`join` で書きます。

**Modelith では** — [アクティビティ図](/next/diagrams/activity) で、開始の丸から矢印でつないだ角の丸い四角として描きます。

## 状態と遷移

```sysml
package Fan {
    item def ButtonPressed;

    state def FanStates {
        entry; then off;
        state off;
        state on {
            entry action startMotor;
        }
        transition first off accept ButtonPressed then on;
        transition first on accept ButtonPressed then off;
    }
}
```

- **状態定義**（`state def`）の中に、**状態**（`state`）を書きます。`entry; then off;` は最初の状態です。
- **遷移**（`transition first a accept E then b;`）は、状態 a のときに E を受けたら状態 b に移る、という意味です。`if 条件` と `do 動作` も書けます。
- 状態の中の `entry`・`do`・`exit` は、入るとき・その間・出るときの振る舞いです。

**Modelith では** — [状態遷移図](/next/diagrams/state-machine) で、角の丸い四角と、「きっかけ [条件] / 動作」のラベルの矢印で描きます。

## シナリオとメッセージ

```sysml
package Doorbell {
    item def Ring;
    part def Visitor;
    part def Bell;
    occurrence def Visit {
        part visitor : Visitor;
        part bell : Bell;
        message press of Ring from visitor to bell;
    }
}
```

**シナリオ**（`occurrence def`）の中に、登場する部品と、その間の **メッセージ**（`message`）を書きます。

**Modelith では** — [シーケンス図](/next/diagrams/sequence) で、部品をライフライン、メッセージを矢印として描きます。

## ビュー（作成した図）

```sysml
package Shop {
    part def Register;
    part def Scanner;
    requirement def FastCheckout;

    view Hardware : GeneralView {
        expose Shop::*;
        filter @SysML::PartDefinition;
    }
}
```

- **ビュー**（`view`）は、モデルのどの要素をどの描き方で見せるかを書いたものです。
- `expose` で図に出す要素を、`filter` で絞り込む条件を書きます。`GeneralView` などは SysML v2 の標準のビューです。

**Modelith では** — 「作成した図」として、＋メニューから開けます。画面の「新しい図を作成」で作ることもできます。→ [新しい図を作成する](/next/diagrams/create-diagram)

## メモとコメント

```sysml
package Robot {
    part def Arm {
        doc /* 物をつかむ腕 */
    }
    comment armNote about Arm /* 重さは 2 kg 以下にする */
}
```

- `doc /* … */` は、要素の説明です（要求の文章などにも使います）。
- `comment … about A /* … */` は、要素 A に付けるメモです。

**Modelith では** — `doc` は箱の中の文章に、`comment … about` は「すべて」などの図に、角を折った四角のメモとして出ます。

## もっと知りたいとき

- Modelith がどの書き方に対応しているかは、[対応している書き方](/next/sysml/support) を見てください。
- SysML v2 の仕様書・文法・標準ライブラリは、[Systems-Modeling/SysML-v2-Release](https://github.com/Systems-Modeling/SysML-v2-Release) で公開されています。
