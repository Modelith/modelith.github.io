# トレーサビリティとフェーズ

利用者の関心事から、要求・要求を満たす部品・検証までのつながりを見る図です。Modelith 独自の図で、SysML v2 では GeneralView で描く図に当たります。
要素を **フェーズ**（利用者要求・システム要求・方式設計・検証）に分けると、フェーズで絞り込んだり、つながりの抜け（トレースの抜け）を見つけたりできます。

![コーヒーメーカーのトレーサビリティ。上から利用者要求、システム要求、それを満たす部品と検証](/images/next/diagram-traceability.jpg)

## 図に出るもの

| 要素 | 箱 |
| --- | --- |
| 関心事（`concern def`） | «concern def» |
| 要求（`requirement def`、パッケージの直下の `requirement`） | «requirement def»・«requirement»。`doc` の文章を箱の中に書きます |
| 検証（`verification def`） | «verification def» |
| 解析（`analysis def`） | «analysis def» |
| 要求を満たす要素 | 満たす関係でつながる部品定義など |

要求と検証の箱には、テキストに書いた次のものも区画に書きます。

| 箱 | 区画に書くもの | テキストの例 |
| --- | --- | --- |
| 要求 | 要求の文章 | `doc /* 3 分以内に抽出できる温度になる */` |
| 要求 | 満たすべき制約の式（`{ … }`） | `require constraint { heatUpTime <= 180 }` |
| 要求 | 前提の式（`assume { … }`） | `assume constraint { roomTemperature >= 5 }` |
| 要求など | 満たすべき制約の式（`assert { … }`、否定は `assert not { … }`） | `assert constraint { … }`・`assert not constraint { … }` |
| 検証・解析 | 目的の説明（`objective: …`）と式 | `objective { doc /* … */ verify BrewTime; }` |

パッケージの直下に書いた検証・解析の使用（`verification quickCheck : BrewTimeTest;` など）は、[すべて](/next/diagrams/all) の図と、作成した一般の図に出ます。型の無い検証の使用の中の `verify` からも、検証の線を引きます。

| 関係 | 線 | テキスト |
| --- | --- | --- |
| 満たす | «satisfy» の破線の矢印 | `satisfy WaterTemperature by Machine;` |
| 検証する | «verify» の破線の矢印 | `verification def T { objective { verify WaterTemperature; } }` |
| 扱う | «frame» の破線の矢印（要求 → 関心事） | `requirement def R { frame concern c : C; }` |
| 導出 | «derive» の破線の矢印（下位の要求 → 上位の要求） | `#derivation dependency from WaterTemperature to TastyCoffee;` |

## 図で操作する

パレットの「関心事」・「要求」・「検証」・「解析」・「部品定義」で要素を置けます。
要素を選んで「関係を追加」（または縁の「＋」からドラッグ）で相手を選ぶと、2 つの組み合わせに応じて次の関係を選べます。
要求をつなぐ関係は、**どちらの要素から線を引いても** 選べます。関係の向き（矢印の向き）は、線を引いた向きによらず決まります。

| 線を引く元 → 先 | 選べる関係 |
| --- | --- |
| 部品定義 → 要求 | 要求を満たす «satisfy» |
| 要求 → 部品定義 | この部品で満たす «satisfy» |
| 検証 → 要求 | 要求を検証する «verify» |
| 要求 → 検証 | この検証で確かめる «verify» |
| 要求 → 関心事 | 関心事を扱う «frame» |
| 関心事 → 要求 | この要求で扱う «frame» |
| 要求 → 要求 | この要求から導出する «derive»（線の元が下位、先が上位の要求）・この要求へ展開する «derive»（線の元が上位、先が下位の要求） |
| 定義 → 定義 | 〜として持つ（例：「要求として持つ」） |

フェーズの設定・絞り込みも、図の操作だけでできます（次の [フェーズ](#フェーズ)）。

## テキストで書く

要求の文章（`doc`）は、要求を選んでインスペクタの「要求の文章を編集」で書けます（要求を図で置くと「ここに要求文を書く」が入るので、そこを書き換えます）。テキストで書いても同じです。
要求の番号（`<'S1'>` のような短い名前）、制約と前提の式、検証の目的は、**図からは書けません。テキストで書きます。**

```sysml
requirement def <'S1'> WaterTemperature {
    doc /* 抽出中のお湯を 90〜96 ℃に保つ */
}
satisfy WaterTemperature by Machine;

requirement def <'S3'> HeatUpTime {
    doc /* 電源を入れてから 3 分以内に抽出できる温度になる */
    attribute heatUpTime : Real;
    attribute roomTemperature : Real;
    assume constraint { roomTemperature >= 5 }     // 前提
    require constraint { heatUpTime <= 180 }       // 満たすべき制約
}
verification def HeatUpTest {
    objective {
        doc /* 室温から抽出できる温度になるまでの時間を測る */
        verify HeatUpTime;
    }
}
```

## フェーズ

フェーズは、要素を工程で分ける印です。Modelith では次の 4 つを使います。

| フェーズ | テキストの値 |
| --- | --- |
| 利用者要求 | `StakeholderNeeds` |
| システム要求 | `SystemRequirements` |
| 方式設計 | `Architecture` |
| 検証 | `Verification` |

### フェーズ管理を始める

フェーズがまだ無いモデルでは、図の上のサブバーに「フェーズ管理を始める」が出ます。押すと、最初のパッケージにフェーズの定義が書き足されます。

```sysml
    // フェーズ管理：要素やパッケージに @Phase を付けて分類する（パッケージに付けると中の要素が継承）
    metadata def Phase { attribute stage : PhaseKind; }
    enum def PhaseKind { enum StakeholderNeeds; enum SystemRequirements; enum Architecture; enum Verification; }
```

### 要素にフェーズを付ける

- 要素を選び、インスペクタのフェーズの欄で選びます。
- 要素を右クリックして、メニューの「フェーズ」から選びます。
- 複数の要素を選んで、「フェーズをまとめて設定」で一度に付けられます。

テキストには、要素の中に `@Phase` が書き足されます。パッケージに付けると、中の要素がそのフェーズを引き継ぎます（インスペクタには「（継承）」と出ます）。

```sysml
    requirement def <'S1'> WaterTemperature {
        @Phase { stage = PhaseKind::SystemRequirements; }
        doc /* 抽出中のお湯を 90〜96 ℃に保つ */
    }
```

図では、箱の右上にフェーズの名前が出ます。

### フェーズで絞り込む

サブバーの「フェーズ」で選ぶと、そのフェーズの要素だけを表示します。選んだフェーズの要素と線でつながるほかのフェーズの要素は、薄く表示します。
選択欄の括弧の数は、そのフェーズの要素の数です。

![フェーズを「システム要求」に絞り込んだトレーサビリティ。つながる要素は薄く出る](/images/next/diagram-traceability-phase.jpg)

## トレースの抜け

フェーズを付けた要求について、つながりの抜けを調べます。抜けがあると、サブバーに「トレースの抜け N 件」と出て、抜けのある要求の箱の右上に △ の印が付きます。問題一覧にも △ の印で並びます。抜けが無ければ「トレースの抜けなし」と出ます。

| 要求のフェーズ | 抜けとして知らせること |
| --- | --- |
| 一番上のフェーズ（利用者要求） | どの下位の要求にも展開されていない（導出の線が来ていない） |
| それ以外のフェーズ | 導出元の上位の要求が無い・満たす要素が無い・確かめる検証が無い |

△ の印にマウスを乗せると、何が足りないかが出ます。

### 図で見つけて直す

1. サブバーの「トレースの抜け N 件」を押します。図のまま、最初の抜けのある要求が選ばれ、図の中央に出ます。
2. インスペクタに、「△ トレースの抜け 1 / N 件目」・何が足りないか・直し方が出ます。
3. 「関係を追加」を押し、足りない相手（部品・検証の要素・上位や下位の要求）をクリックします。抜けを直せる関係だけが候補に出るので、それを押します。
4. 関係が足されると、その抜けは消えます。同じ要求にまだ抜けがあれば、その案内に替わります。この要求の抜けがすべて無くなると「この要素のトレースの抜けは解消しました（残り N 件）」と出るので、「次の抜けへ」を押して続けます。抜けが 1 件も無くなると「トレースの抜けはすべて解消しました」と出ます。

抜けが 2 件以上あるときは、案内の「‹」「›」で前後の抜けへ移れます（最後の次は最初に戻ります）。
問題一覧の △ の行を押しても、同じように図の要素へ移って案内が出ます。

![BrewTime の抜けを案内しているところ。箱の右上に △ の印、インスペクタに「トレースの抜け 1 / 2 件目」と直し方](/images/next/trace-gap-guide.jpg)

例：コーヒーメーカーの `BrewTime`（システム要求）は、満たす部品も検証もまだ無いので、抜けが 2 件あります。
1 件目の案内には「この要求を満たす部品がありません」と出ます。「関係を追加」を押して Machine をクリックすると、「この部品で満たす «satisfy»」を選べます。

![「関係を追加」から Machine を選んだところ。「この部品で満たす «satisfy»」が出る](/images/next/trace-gap-connect.jpg)

足りない相手が図にまだ無いとき（検証の要素が 1 つも無いときなど）は、先にパレットで置いてから「関係を追加」を押します。

| 何が足りないか | 「関係を追加」で選ぶ相手 | 出る関係 |
| --- | --- | --- |
| この要求を満たす部品がありません | 部品定義 | この部品で満たす «satisfy» |
| この要求を確かめる検証がありません | 検証 | この検証で確かめる «verify» |
| この要求の導出元になる上位の要求がありません | 上位の要求 | この上位の要求から導出する «derive» |
| この要求は、どの下位の要求にも展開されていません | 下位の要求 | この下位の要求へ展開する «derive» |

::: info 狭い画面でテキストを見ているとき
スマホなど狭い画面で「テキスト」のタブを見ているときは、問題一覧の △ の行を押すと、テキストの行へ移ります。
:::

### テキストで直す

案内の「テキストで見る」を押すと、その要求の宣言に移ります。問題一覧には、次のように出ます。

```text
△ 14 行目：<'S2'> BrewTime：この要求を満たす要素がありません（satisfy）
△ 14 行目：<'S2'> BrewTime：この要求を確かめる検証がありません（verify）
```

足りない関係をテキストで書いても直せます。

```sysml
    satisfy BrewTime by Machine;

    verification def BrewTimeTest {
        @Phase { stage = PhaseKind::Verification; }
        objective { verify BrewTime; }
    }
```

::: tip 例のモデル
この図のモデルは <a href="/examples/coffee-machine.sysml" download>coffee-machine.sysml</a> です。
:::
