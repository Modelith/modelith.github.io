# トレーサビリティとフェーズ

利用者の関心事から、要求・要求を満たす部品・検証までのつながりを見る図です。Modelith 独自の図で、SysML v2 では GeneralView で描く図に当たります。
要素を **フェーズ**（利用者要求・システム要求・方式設計・検証）に分けると、フェーズで絞り込んだり、つながりの抜け（トレースの抜け）を見つけたりできます。

![コーヒーメーカーのトレーサビリティ。上から利用者要求、システム要求、それを満たす部品と検証](/images/diagram-traceability.jpg)

## 図に出るもの

| 要素 | 箱 |
| --- | --- |
| 関心事（`concern def`） | «concern def» |
| 要求（`requirement def`、パッケージの直下の `requirement`） | «requirement def»・«requirement»。`doc` の文章を箱の中に書きます |
| 検証（`verification def`） | «verification def» |
| 解析（`analysis def`） | «analysis def» |
| 要求を満たす要素 | 満たす関係でつながる部品定義など |

| 関係 | 線 | テキスト |
| --- | --- | --- |
| 満たす | «satisfy» の破線の矢印 | `satisfy WaterTemperature by Machine;` |
| 検証する | «verify» の破線の矢印 | `verification def T { objective { verify WaterTemperature; } }` |
| 扱う | «frame» の破線の矢印（要求 → 関心事） | `requirement def R { frame concern c : C; }` |
| 導出 | «derive» の破線の矢印（下位の要求 → 上位の要求） | `#derivation dependency from WaterTemperature to TastyCoffee;` |

## 図で操作する

パレットの「関心事」・「要求」・「検証」・「解析」・「部品定義」で要素を置けます。
要素を選んで「関係を追加」（または縁の「＋」からドラッグ）で相手を選ぶと、2 つの組み合わせに応じて次の関係を選べます。

| 元 → 先 | 選べる関係 |
| --- | --- |
| 部品定義 → 要求 | 要求を満たす «satisfy» |
| 検証 → 要求 | 要求を検証する «verify» |
| 要求 → 関心事 | 関心事を扱う «frame» |
| 要求 → 要求 | この要求から導出する «derive»（元が下位、先が上位の要求） |
| 定義 → 定義 | 〜として持つ（例：「要求として持つ」） |

フェーズの設定・絞り込みも、図の操作だけでできます（次の [フェーズ](#フェーズ)）。

## テキストで書く

要求の文章（`doc`）は、**図からは書けません。テキストで書きます。** 要求を図で置くと `doc /* ここに要求文を書く */` が入るので、その中を書き換えます。
要求の番号（`<'S1'>` のような短い名前）も、テキストで書きます。

```sysml
requirement def <'S1'> WaterTemperature {
    doc /* 抽出中のお湯を 90〜96 ℃に保つ */
}
satisfy WaterTemperature by Machine;
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

![フェーズを「システム要求」に絞り込んだトレーサビリティ。つながる要素は薄く出る](/images/diagram-traceability-phase.jpg)

## トレースの抜け

フェーズを付けた要求について、つながりの抜けを調べます。抜けがあると、サブバーに「トレースの抜け N 件」と出て、問題一覧に △ の印で並びます。抜けが無ければ「トレースの抜けなし」と出ます。

| 要求のフェーズ | 抜けとして知らせること |
| --- | --- |
| 一番上のフェーズ（利用者要求） | どの下位の要求にも展開されていない（導出の線が来ていない） |
| それ以外のフェーズ | 導出元の上位の要求が無い・満たす要素が無い・確かめる検証が無い |

例：コーヒーメーカーの `BrewTime`（システム要求）は、満たす部品も検証もまだ無いので、次の 2 件が出ます。

```text
△ 14 行目：<'S2'> BrewTime：この要求を満たす要素がありません（satisfy）
△ 14 行目：<'S2'> BrewTime：この要求を確かめる検証がありません（verify）
```

「トレースの抜け N 件」を押すと、最初の抜けの行をテキストで示します。

::: tip 例のモデル
この図のモデルは <a href="/examples/coffee-machine.sysml" download>coffee-machine.sysml</a> です。
:::
