# シーケンス図

シナリオ（`occurrence def`）の中で、部品の間でやり取りするメッセージを、時間の順に上から下へ描く図です。SysML v2 では SequenceView です。

![ロボット掃除機のシーケンス図。user から app へ tapStart、app から vacuum へ sendStart](/images/diagram-sequence.jpg)

## 対象を選ぶ

サブバーの「シナリオ」で、どのシナリオを描くかを選びます。モデルのツリーでシナリオの「開く」を押しても開けます。タブには `sd StartFromApp` のように出ます。

## 図に出るもの

| 要素・関係 | 描き方 | テキストの例 |
| --- | --- | --- |
| ライフライン | シナリオの中の部品。«part» の箱と、下へ伸びる破線 | `part app : PhoneApp;` |
| メッセージ | ライフラインの間の矢印。番号・名前・型を書きます | `message sendStart of StartCommand from app to vacuum;` |
| イベント | ライフラインの上の白抜きの丸と `.名前` の札 | `part user : User { event occurrence press; }` |
| イベントの順序 | 別のライフラインのイベントの間の破線の矢印 | `first user.press then app.received;` |

- メッセージは、書いた順に上から並べます。順序（`first … then`）を書いたときは、その順序に従います。
- メッセージの端に `user.press` のようにイベントを書くと、ライフラインの上のそのイベントにつなぎます。
- 順序が循環しているときや、相手が見つからないときは、問題一覧で知らせます。
- モデルのツリーでは、シナリオの下にメッセージが番号付きで並びます。

## 図で操作する

シナリオ・ライフライン・メッセージは、テキストを書かずに図だけで足せます。

- **シナリオ** — パレットの「シナリオ」で、新しいシナリオを作ります。
- **ライフライン** — パレットの「ライフラインを追加…」で部品定義を選ぶと、その型の部品をライフラインとして足します。
- **メッセージ** — ライフラインから横にドラッグして、相手のライフラインで離すと、メッセージを足します。
- メッセージを選ぶと、インスペクタで「上へ」・「下へ」（順番の入れ替え）、「名前・型を編集」、「削除」ができます。型は、モデルのアイテム定義から選びます。
- イベントの順序の線は、選んで削除できます。

## テキストで書く

イベントとイベントの順序、メッセージの端のイベントは、**図からは足せません。テキストで書きます。**

```sysml
occurrence def StartFromApp {
    part user : User { event occurrence press; }
    part app : PhoneApp { event occurrence received; }
    part vacuum : Vacuum;
    first user.press then app.received;
    message sendStart of StartCommand from app to vacuum;
}
```

## できないこと（0.1.0-beta.6）

- 分岐や繰り返しの枠（`alt`・`loop` に当たるもの）は描きません。
- 入れ子のシーケンス図、ライフラインの頭のポートは描きません。

::: tip 例のモデル
この図のモデルは <a href="/examples/robot-vacuum.sysml" download>robot-vacuum.sysml</a> です。
:::
