---
layout: home
title: Modelith
titleTemplate: SysML v2 モデリングエディタの使い方

hero:
  name: Modelith
  text: 書いても、描いても、同じモデル
  tagline: 図だけでも、テキストだけでも、両方を行き来しても、同じ SysML v2 のモデルを作れるオープンソースのエディタです。ブラウザを開くだけで使えます。
  image:
    src: /logo.svg
    alt: Modelith のロゴ
  actions:
    - theme: brand
      text: ブラウザで試す
      link: https://modelith.github.io/modelith/
    - theme: alt
      text: はじめる
      link: /guide/getting-started
    - theme: alt
      text: Modelith とは
      link: /guide/what-is-modelith

features:
  - icon: ✎
    title: 図だけで描く
    details: パレットで要求や部品を置き、線を引くだけでモデルを作れます。SysML v2 の書き方を知らなくても始められます。
    link: /guide/getting-started
    linkText: はじめての図
  - icon: ⌨
    title: テキストだけで書く
    details: 書き方を知っていれば、テキストを打つだけで図が描かれます。モデルはただのテキストファイルなので、Git で差分を追えます。
    link: /guide/text-and-diagram#テキストだけで書く
    linkText: テキストで書く
  - icon: ⇄
    title: 両方を行き来する
    details: 図で足せばテキストが書き換わり、テキストを直せば図が変わります。どの方法で作っても、同じモデル・同じファイルになります。
    link: /guide/text-and-diagram#図とテキストを行き来する
    linkText: 図とテキストを行き来する
  - icon: ▦
    title: 目的に合わせた図
    details: トレーサビリティ・ブロック定義図・内部ブロック図・シーケンス図・アクティビティ図・状態遷移図など、同じモデルを見たい切り口で表示できます。
    link: /diagrams/
    linkText: 図の種類
  - icon: ✓
    title: 要求の抜けに気づける
    details: 利用者要求から方式設計・検証までのつながりをたどり、導出・充足・検証の抜けを知らせます。
    link: /diagrams/traceability
    linkText: トレーサビリティ
  - icon: ⌂
    title: モデルは手元から出ない
    details: インストールもアカウントも不要です。モデルを外部に送信せず、アクセス解析も使いません。
    link: /guide/what-is-modelith
    linkText: 動作環境とデータの扱い
  - icon: ⚑
    title: チームの決まりを確かめる
    details: チェックルールのプラグインで、「要求には、それを満たす要素が必要」のようなチームの決まりに合わない要素を問題一覧に示します。
    link: /guide/plugins
    linkText: チェックルールとプラグイン
  - icon: ⧉
    title: 他のツールに持ち出す
    details: 表示中の図を SVG で保存したり、draw.io 形式で書き出したりできます。
    link: /diagrams/editing#書き出す
    linkText: 書き出し
---

<div class="home-shot">

<ThemeImage light="/images/overview.jpg" dark="/images/overview-dark.jpg" alt="Modelith の画面。左にモデルのツリー、中央にロボット掃除機のブロック定義図、右に SysML v2 のテキスト" />

</div>

::: warning 開発中の beta 版です
いまは **0.1.0 に向けた beta 版**（このマニュアルは 0.1.0-beta.4 に合わせています）です。機能を固定し、0.1.0 までは不具合の修正だけを行います。
操作方法や保存形式は、予告なく変わることがあります。大切なモデルは、こまめに手元のファイルとして保存してください。
不具合のご報告やご要望は、[GitHub Issues](https://github.com/modelith/modelith/issues/new/choose) にお寄せください。
:::
