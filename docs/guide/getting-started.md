# はじめての図

自転車のライトを例に、テキストでモデルを書き、図で関係を足し、ファイルに保存するまでを 10 分ほどで試します。
SysML v2 の書き方を知らなくても進められます。ここでは Chrome か Edge を使います（Safari・Firefox の違いは最後に書きます）。

## 1. Modelith を開いて、新しいファイルを作る

ブラウザで [https://modelith.github.io/modelith/](https://modelith.github.io/modelith/) を開きます。初めて開くと、サンプルのモデル（電気ケトル）が表示されます。

画面右上の「ファイル」を押して、「新しいファイル」を選びます。
空のファイル `untitled-1.sysml` が開き、左のエクスプローラーの「開いているファイル」に加わります。

![新しいファイルを作った直後の画面。図とテキストは空](/images/tutorial-1-new-file.jpg)

::: tip まだ保存先はありません
新しいファイルには保存先がありません。保存するまでは、このブラウザの中に下書きとして自動で残ります（ブラウザを閉じても、次に開いたときに戻ります）。保存は手順 6 で行います。
:::

## 2. テキストを書く

右のテキストの欄に、次の内容を書きます（コピーして貼り付けてかまいません）。

```sysml
package BicycleLight {
    requirement def BrightEnough {
        doc /* 夜道で 10 m 先まで照らせる */
    }

    part def Light {
        part battery : Battery;
        part led : Led;
        part button : Switch;
    }
    part def Battery {
        attribute voltage = 3.7;
    }
    part def Led;
    part def Switch;
}
```

書いた内容は、入力が止まるとすぐ図に出ます。何を書いたかは、次のとおりです。

| 書いたもの | 意味 | 図での見え方 |
| --- | --- | --- |
| `package BicycleLight { … }` | パッケージ。モデルの要素を入れる入れ物です | 図には出ません（モデルのツリーの一番上に出ます） |
| `requirement def BrightEnough` | 要求。`doc` に要求の文章を書きます | «requirement def» の箱 |
| `part def Light { … }` | 部品定義。ライトという部品の型です | «part def» の箱 |
| `part battery : Battery;` | ライトが持つ部品。`battery` という名前の、`Battery` 型の部品です | Light から Battery への線（`battery` のラベル付き） |
| `attribute voltage = 3.7;` | 属性（値） | Battery の箱の中の行 |

![テキストを書くと、要求と部品定義が図に出る](/images/tutorial-2-text.jpg)

::: tip 語の意味を確かめる
テキストの `requirement def` や `part` などの語にマウスを乗せると、その意味が吹き出しで出ます。カーソルのある語の意味は、テキストの下の行にも出ます。→ [語の説明](/guide/screen#語の説明)
:::

書き間違えたときは、テキストの下の [問題一覧](/guide/screen#問題一覧) に、行番号と理由が出ます。押すとその行に移ります。

## 3. 図で関係を足す

ライト（Light）が要求（BrightEnough）を満たす、という関係を、図の上で足してみます。

1. 図の Light の箱をクリックして選びます。図の下に、選んだ要素の操作（インスペクタ）が出ます。
2. インスペクタの「関係を追加」を押します。「接続先の要素をタップしてください」と出ます。
3. BrightEnough の箱をクリックします。インスペクタに、この 2 つの間に追加できる関係が並びます。
4. 「要求を満たす «satisfy»」を押します。

![Light から BrightEnough への関係を選ぶところ。「要求として持つ」と「要求を満たす «satisfy»」が選べる](/images/tutorial-3-connect.jpg)

選んだ要素の縁に出る「＋」から、相手の要素までドラッグしても、同じように関係を選べます。

## 4. テキストに戻る

関係を足すと、図に «satisfy» の破線の矢印が引かれ、テキストに 1 行が書き足されます。書き足した行は、しばらく色が付きます。

```sysml
    satisfy BrightEnough by Light;
```

![図に «satisfy» の線が引かれ、テキストの最後に satisfy の行が足された](/images/tutorial-4-text-updated.jpg)

図での操作は、すべてテキストの書き換えになります。テキストのこの行を消せば、図の線も消えます。
操作を取り消すときは、画面上部の「↶」（元に戻す、Ctrl+Z）を押します。

::: tip 図の配置
図の箱はドラッグで動かせます。動かした位置は、モデルとは別の「図の配置」として保存されます（手順 6）。自動で並べ直すときは「整列」を押します。
:::

## 5. ほかの図で見る

図の上のタブの右にある「＋」を押すと、同じモデルを別の図で開けます。
たとえば「内部ブロック図」を開くと、Light の中に battery・led・button の部品が並びます。「トレーサビリティ」では、要求とそれを満たす Light が並びます。

図の種類は [図の種類と開き方](/diagrams/) をご覧ください。

## 6. 保存する

「ファイル → 保存」（Ctrl+S）を押します。新しいファイルなので、保存先を決めます。

1. フォルダを選ぶ画面が出ます。保存先のフォルダを選び、ブラウザの確認でファイルの編集を許可します。
2. 「名前を付けて保存」の画面で、ファイル名（例：`bicycle-light.sysml`）を入れて「保存」を押します。

![名前を付けて保存の画面。フォルダ「my-models」に保存する](/images/tutorial-5-save.jpg)

フォルダには、モデルのファイル `bicycle-light.sysml` と、図の配置を入れたファイル `bicycle-light.layout.json` の 2 つができます。
エクスプローラーにフォルダの中身が出て、以後は Ctrl+S で上書き保存できます。

![エクスプローラーに、保存したファイルが出ている](/images/tutorial-6-saved.jpg)

::: info Safari・Firefox の場合
フォルダを開けないため、保存は **ダウンロード** になります。モデル（`.sysml`）と図の配置（`.layout.json`）の 2 つのファイルがダウンロードされます。
続きを編集するときは「ファイル → ファイルを開く…」で、2 つのファイルを一緒に選ぶと、図の配置も戻ります。→ [ファイルとフォルダ](/guide/files)
:::

## 次に読む

- [画面の見方](/guide/screen) — 画面の各部分と、キーボードの操作
- [SysML v2 の書き方入門](/sysml/basics) — よく使う書き方と、それが Modelith でどう見えるか
- [図の種類と開き方](/diagrams/) — 9 種類の図と、保存された図
