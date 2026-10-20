# リリースノート

Modelith の各バージョンで変わったことです。いまは 0.1.0 に向けた alpha 版を、おおむね 1 週間ごとに公開しています。
ダウンロードやタグは [GitHub Releases](https://github.com/modelith/modelith/releases) にもあります。

## 最新：0.1.0-alpha.10

正しい SysML v2 の書き方なのに、誤ったエラーや「見つかりません」が出ていた書き方を直しました。

- 本体が `true`・`false`・`not` で始まる制約、`->collect{ … }` のような式、宣言する形の `satisfy requirement r : R by x;` などで、誤ったエラーが出なくなりました
- `flow a to b;`・`message a to b;`・`interface a to b;` のような短い書き方と、`perform x.y;`・`exhibit s;`・`frame c;` を読むようになりました
- [対応している書き方](/sysml/support) の表から、誤った表示（⚠️）が無くなりました

[0.1.0-alpha.10 のリリースノート](/releases/v0.1.0-alpha.10)

## すべてのバージョン

| バージョン | 主な内容 |
| --- | --- |
| [0.1.0-alpha.10](/releases/v0.1.0-alpha.10) | 誤ったエラーや表示が出ていた書き方を直し、短い流れ・メッセージ・インタフェースと既存の要素を指す書き方を読む |
| [0.1.0-alpha.9](/releases/v0.1.0-alpha.9) | アクティビティ図・状態遷移図・シーケンス図のイベントと順序、語の説明、スマホの画面 |
| [0.1.0-alpha.8](/releases/v0.1.0-alpha.8) | 特殊化・依存・多重度・接続・結び付け・割り当て・メモを図に描く。内部ブロック図の入れ子。開いているファイルが無いときの画面 |
| [0.1.0-alpha.7](/releases/v0.1.0-alpha.7) | 読める SysML v2 の書き方を増やし、誤った表示をなくした。対応状況の公開 |
| [0.1.0-alpha.6](/releases/v0.1.0-alpha.6) | 画面に機能を追加するプラグイン（TypeScript）、実行の許可、このブラウザへの追加 |
| [0.1.0-alpha.5](/releases/v0.1.0-alpha.5) | プロジェクト（modelith.json）と、チェックルールのプラグイン |
| [0.1.0-alpha.4](/releases/v0.1.0-alpha.4) | 保存した図の中でパッケージを枠で囲む。大きなモデルでの動きを軽く |
| [0.1.0-alpha.2](/releases/v0.1.0-alpha.2) | 図を名前を付けて保存。図の配置を別のファイルに保存 |

0.1.0-alpha.1（最初の公開）と 0.1.0-alpha.3（テキストの読み取りの仕組みの入れ替え）のノートは、このサイトにはありません。[GitHub Releases](https://github.com/modelith/modelith/releases) をご覧ください。

ご注意・商標・ライセンスは [ライセンスと商標](/license) にまとめています。
