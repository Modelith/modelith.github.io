# テキストで書く・行き来する

Modelith のモデルは、図だけでも、テキストだけでも、両方を行き来しても作れます。どの方法でも、同じ SysML v2 のテキストのファイルになります。
図だけで作る方法は [はじめての図](/guide/getting-started) で説明しました。このページでは、テキストで書く方法と、図とテキストを行き来する使い方を説明します。

## テキストだけで書く

SysML v2 の書き方を知っているなら、右のテキストの欄に直接書けます。入力が止まると、すぐ図・モデルのツリー・問題一覧に反映します。

1. 「ファイル → 新しいファイル」で、空のファイルを開きます。
2. 右のテキストの欄に、次の内容を書きます（コピーして貼り付けてかまいません。<a href="/examples/bicycle-light.sysml" download>bicycle-light.sysml</a> としてダウンロードもできます）。

```sysml
package BicycleLight {
    requirement def BrightEnough {
        doc /* 夜道で 10 m 先まで照らせる */
    }

    part def Light {
        part battery : Battery;
        part led : Led;
        part button : Switch;
        flow from battery to led;
    }
    part def Battery {
        attribute voltage = 3.7;
    }
    part def Led;
    part def Switch;

    satisfy BrightEnough by Light;
}
```

「すべて」の図に、要求と部品定義と、その間の線が描かれます。何を書いたかは、次のとおりです。

| 書いたもの | 意味 | 図での見え方 |
| --- | --- | --- |
| `package BicycleLight { … }` | パッケージ。モデルの要素を入れる入れ物です | 図には出ません（モデルのツリーの一番上に出ます） |
| `requirement def BrightEnough` | 要求。`doc` に要求の文章を書きます | «requirement def» の箱 |
| `part def Light { … }` | 部品定義。ライトという部品の型です | «part def» の箱 |
| `part battery : Battery;` | ライトが持つ部品。`battery` という名前の、`Battery` 型の部品です | Light から Battery への線（`battery` のラベル付き） |
| `flow from battery to led;` | 電池から LED への流れ | 内部ブロック図の矢印 |
| `attribute voltage = 3.7;` | 属性（値） | Battery の箱の中の行 |
| `satisfy BrightEnough by Light;` | Light が要求 BrightEnough を満たす | «satisfy» の破線の矢印 |

![テキストを書くと、要求と部品定義が図に出る](/images/text-1-written.jpg)

::: tip 語の意味を確かめる
テキストの `requirement def` や `part` などの語にマウスを乗せると、その意味が吹き出しで出ます。カーソルのある語の意味は、テキストの下の行にも出ます。→ [語の説明](/guide/screen#語の説明)
:::

書き間違えたときは、テキストの下の [問題一覧](/guide/screen#問題一覧) に、行番号と理由が出ます。押すとその行に移ります。

よく使う書き方は [SysML v2 の書き方入門](/sysml/basics)、Modelith が読める書き方は [対応している書き方](/sysml/support) にまとめています。

## 図とテキストを行き来する

図とテキストは、いつも同じモデルを表示しています。どちらで変えても、もう一方にすぐ反映します。得意なほうで操作できます。

### 図で足すと、テキストが変わる

上のモデルに、要求を確かめる検証を図で足してみます。

1. 図のタブの「＋」から「トレーサビリティ」を開き、パレットの「検証」を押して、図の上をクリックします。名前を `BrightnessTest` にします。
2. BrightnessTest を選んで「関係を追加」を押し、BrightEnough をクリックして、「要求を検証する «verify»」を押します。

テキストには、次の内容が書き足されます。書き足した行は、しばらく色が付きます。

```sysml
    verification def BrightnessTest {
        objective { verify BrightEnough; }
    }
```

![図で検証を足すと、テキストに verification def と verify の行が書き足される](/images/text-2-from-diagram.jpg)

### テキストを直すと、図が変わる

テキストの `attribute voltage = 3.7;` を `attribute voltage = 3.0;` に書き換えると、図の Battery の箱の中の値も変わります。
テキストの `satisfy BrightEnough by Light;` の行を消すと、図の «satisfy» の線も消えます。

### 使い分けの例

- 要素を置く・名前を変える・関係を引く・消す・図を保存するといった操作は、図でもテキストでもできます。図で操作すると、書き方を覚えていなくても、正しいテキストが書かれます。
- 要求の文章・属性の値・状態や遷移のきっかけ・制約の式など、**図に道具の無いものはテキストで書きます**。各図のページの「テキストで書く」に、図でできることとテキストでしかできないことをまとめています。→ [図の種類と開き方](/diagrams/)
- 名前を変えるときは、図の「名前を変更」を使うと、その名前を使っている箇所もまとめて変わります。

::: tip 図だけで使うとき
図だけで使うときも、テキストは消さずに表示しておくと、図の操作で何が書き足されたかを確かめられます。図を広く使いたいときは「表示 → テキスト」でテキストの欄を隠せます。
:::

## 次に読む

- [画面の見方](/guide/screen) — 画面の各部分と、メニュー・キーボードの操作
- [図の操作と書き出し](/diagrams/editing) — 図で置ける要素と引ける関係の一覧
- [SysML v2 の書き方入門](/sysml/basics) — よく使う書き方と、それが Modelith でどう見えるか
