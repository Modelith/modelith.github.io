# 保存された図

見たい要素だけを集めた図に名前を付けて保存できます。保存した図には、あとから要素を入れたり外したりできます。
保存した図は、テキストに SysML v2 の **ビュー（`view`）** として書かれるので、モデルと一緒にファイルに残り、ほかの人とも共有できます。

## 図を保存する

1. 組み込みの図（ブロック定義図など）を表示して、サブバーの「図を保存」を押します。
2. 「図を保存」の画面で、図の名前を入れて「保存」を押します。

![図を保存の画面。図の名前に「構成の概要」と入れたところ](/images/save-view-dialog.jpg)

いま図に出ている要素を集めた図ができ、新しいタブで開きます。テキストには、次のような `view` が書き足されます。

```sysml
view '構成の概要' : GeneralView {
    expose RobotVacuum::Battery;
    expose RobotVacuum::SuctionMotor;
    expose RobotVacuum::Controller;
    expose RobotVacuum::Vacuum;
    expose RobotVacuum::User;
    expose RobotVacuum::PhoneApp;
}
```

`expose` は「この要素を図に出す」という意味です。日本語などの名前は `'…'` で囲みます。図の配置も、保存した時点の配置を引き継ぎます。

![保存した図「構成の概要」を開いたところ。テキストに view が足されている](/images/saved-view.jpg)

内部ブロック図・シーケンス図・アクティビティ図・状態遷移図を保存すると、その図の対象を `expose` した、それぞれの種類の `view` になります。

## 保存した図を開く

- 図のタブの「＋」のメニューの「保存された図」から開きます。
- モデルのツリーにも、保存された図が出ます。「開く」で開けます。

保存された図のタブでは、サブバーに「保存された図「構成の概要」：一般ビュー」のように、名前と図の種類が出ます。

## 要素を入れる・外す

保存した一般ビュー（ブロック定義図・トレーサビリティ・すべてなどから保存した図）では、図に出す要素を変えられます。

- **入れる** — パレットから要素を置くと、モデルに要素を足して、この図にも入れます。モデルのツリーから要素を図にドラッグするか、ツリーの行の「追加」（右クリックでは「この図に入れる」）を押すと、既にある要素をこの図に入れます。
- **外す** — 要素を右クリックして「この図から外す」を選びます。図から外しても、モデルの要素は消えません。モデルから消すときは「モデルから削除」を選びます。

テキストでは、`expose` の行が足されたり消えたりします。

## テキストで書く

`view` はテキストで書くこともできます。書いた `view` は、＋メニューの「保存された図」から図として開けます。

```sysml
// パッケージの中のすべての要素を出す
view AllParts : GeneralView {
    expose RobotVacuum::*;
}

// 種類で絞り込む（部品定義とポート定義だけ）
view PartsAndPorts : GeneralView {
    expose RobotVacuum::*;
    filter @SysML::PartDefinition or @SysML::PortDefinition;
}

// 内部ブロック図
view VacuumInside : InterconnectionView {
    expose Vacuum;
}
```

| 書くもの | 意味 |
| --- | --- |
| `view 名前 : 種類 { … }` | 図。種類は下の表の標準のビュー。種類を書かなければ一般ビューになります |
| `expose A;` | 要素 A を図に出す。`P::*` はパッケージ P の中の要素、`P::**` は入れ子の中まですべて |
| `filter 条件;` | 出す要素を絞り込む。`@SysML::PartDefinition` のような種類や、`and`・`or`・`xor`・`not`・括弧、`istype`・`hastype` で組み合わせます |
| `render asTreeDiagram;` | 描き方を決める（`asTreeDiagram` はノードと線の図、`asInterconnectionDiagram` は内部ブロック図） |

| 標準のビュー | 画面での名前 | 描き方 |
| --- | --- | --- |
| `GeneralView` | 一般ビュー | ノードと線の図 |
| `InterconnectionView` | 内部ブロック図 | `expose` した部品定義の中身 |
| `ActionFlowView` | アクティビティ図 | `expose` したアクション定義の流れ |
| `StateTransitionView` | 状態遷移図 | `expose` した状態定義の状態と遷移 |
| `SequenceView` | シーケンス図 | `expose` したシナリオ |

`GeometryView`・`GridView`・`BrowserView` は、まだ専用の描き方が無く、ノードと線の図で代わりに描きます（そのことを問題一覧で知らせます）。

### パッケージを枠で囲む

保存した図に、パッケージそのものを `expose` すると、パッケージを名前付きの枠（フォルダの形）で描き、中の要素を枠の中に並べます。パッケージの中のパッケージは、枠の中の枠になります。

```sysml
package Home {
    package Drive {
        part def Motor;
        part def Wheel;
    }
    part def Body;

    view Layout : GeneralView {
        expose Home::Drive;
        expose Home::Body;
    }
}
```

## できないこと（0.1.0-alpha.10）

- `import` を通した名前や、ほかのファイルの要素は `expose` できません（0.2.0 で対応する予定です）。
- メタデータの値を比べる `filter`（`level > 1` など）は使えません（0.3.0 以降の予定です）。
