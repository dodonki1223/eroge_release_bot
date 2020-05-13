# eroge_release_gas

スクレイピングした美少女ゲーム情報が書き込まれたGoogleスプレッドシートツールです

## 概要

主に以下の２つの機能を持ちます

- 声優名で話しかけると出演するゲームを教えてくれる `LINE BOT` （発売リストくん）
- 美少女ゲームの情報を格納するデータベースの情報に整形しS3にアップロードする機能

## 発売リストくん

声優名で話しかけると出演するゲームを教えてくれる `LINE BOT` です

![00_release_list_line_bot](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/readme/00_release_list_line_bot.png)

### 仕組み

大まかな仕組みを説明します

#### 処理の流れ

1. [eroge_release_cmd](https://github.com/dodonki1223/eroge_release_cmd)を使用し、[げっちゅ屋](http://www.getchu.com/top.html?gc=gc)の[発売日リスト](http://www.getchu.com/all/price.html?genre=pc_soft&year=2019&month=3&gage=&gall=all)ページをスクレイピングしスクレイピング結果をCSV出力する
2. 出力されたCSV結果をGoogleスプレッドシートに書き込み
3. 発売リストくん（LINE BOT）に声優名を入力
4. Googleスプレッドシートから声優の出演情報を元にゲームの情報を検索
5. ゲームの情報を発売リストくん（LINE BOT）に返す

#### その他

Googleスプレッドシートには以下のような感じで書き込まれています  
データの検索、発売リストくん（LINE BOT）への結果通知は `Google Apps Script` で書かれています

![01_google_spread_sheet_sample](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/readme/01_google_spread_sheet_sample.png)

### 登録方法

`友だち追加` ボタンをクリックするか `QRコード` から友達追加をして下さい

| <a href="https://line.me/R/ti/p/%40kox6824y"><img height="36" border="0" alt="友だち追加" src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png"></a> | ![02_qr_code](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/readme/02_qr_code.png) |
|:-------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------:|

### 使用方法

登録した `発売リストくん（LINE BOT）` に `声優名` もしくは `リスト` と話しかけるだけです  
`声優名` と `リスト` それぞれ話しかけ方は３パターンあります

- 声優名 or リスト
- 先月の 声優名 or リスト
- 来月の 声優名 or リスト

| ![03_voice_actor_sample](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/readme/03_voice_actor_sample.png) | ![04_release_list_sample](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/readme/04_release_list_sample.png) |
|:-------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------:|

サンプル画像は2019年4月に実行したものになります。

### Slack通知

Slackに発売のリスト情報を定期で通知させます

![05_notify_slack_sample](https://raw.githubusercontent.com/dodonki1223/image_garage/master/eroge_release_gas/release_list_line_bot/readme/05_notify_slack_sample.png)

### 環境構築

- [発売リストくん構築手順書](https://github.com/dodonki1223/eroge_release_gas/blob/master/documents/EROGE_RELEASE_LINE_BOT_CONSTRUCTION.md)
- [発売リストくんSlack通知構築手順書](https://github.com/dodonki1223/eroge_release_gas/blob/master/documents/NOTIFY_EROGE_RELEASE_SLACK_CONSTRUCTION.md)

### 資料

- [Messaging APIリファレンス](https://developers.line.biz/ja/reference/messaging-api/)
- [Google Apps Script ドキュメント](https://developers.google.com/apps-script/guides/services/quotas)
