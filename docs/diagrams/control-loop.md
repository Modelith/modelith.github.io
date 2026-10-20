# 制御ループ

制約や計算と、それに関わる部品の流れを見る図です。センサー → 制御器 → ヒーターのような制御のつながりを確かめるのに使います。
Modelith 独自の図で、SysML v2 では GeneralView で描く図に当たります（SysML v2 の標準のビューに、これに当たるものはありません）。

![コーヒーメーカーの制御ループ。温度センサー・温度制御器・ヒーターの流れと、計算・制約](/images/diagram-control-loop.jpg)

## 図に出るもの

| 要素・関係 | 描き方 | テキストの例 |
| --- | --- | --- |
| 制約定義（`constraint def`） | «constraint def» の箱。式を箱の中に書きます | `constraint def TemperatureRange { attribute t : Real; t >= 90 and t <= 96 }` |
| 計算定義（`calc def`） | «calc def» の箱 | `calc def HeaterPower { … }` |
| 流れでつながる部品の型 | «part def» の箱と、流れの矢印 | `part def Machine { part sensor : TempSensor; part controller : TempController; flow from sensor to controller; }` |
| 部品として持つ | 実線と名前 | `part def TempController { calc power : HeaterPower; }` |

`flow from sensor to controller;` のように、ある部品定義の中で 2 つの部品の間に流れを書くと、それぞれの部品の型（`TempSensor` と `TempController`）の間に流れの矢印を描きます。

式は文字列として表示するだけで、計算はしません（式の計算は 0.3.0 以降の予定です）。

## 図で足す

- パレットの「部品定義」・「制約定義」で要素を置けます。
- 2 つの部品定義を、両方を部品として持つ部品定義があれば、「関係を追加」の「信号・物理量を流す（flow）」でつなげます。テキストには `flow from sensor to controller;` のような行が足されます。

::: tip 例のモデル
この図のモデルは <a href="/examples/coffee-machine.sysml" download>coffee-machine.sysml</a> です。
:::
