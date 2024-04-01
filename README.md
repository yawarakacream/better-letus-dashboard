# Better LETUS Dashboard 2024 Spring

LETUS のダッシュボードを改良する User Script

開発環境  
Chrome [Violentmonkey](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag) 2.18.0

ダッシュボード「テキストブロック」内 <script> にコピペすることでも使用可能

## 機能

### 上部に時間割を追加する

<img width="1097" src="https://user-images.githubusercontent.com/70136871/155876260-b6eed26a-bd7f-4381-a7e1-c173bec6d764.png">

前期・後期を切り替えられる

下部に時間割に載らない集中講義等のショートカットを配置可能

## 導入方法

テキストブロック の方を推奨  
この方法だと携帯版でも動作する

### テキストブロック
<details>
  <summary>スポイラー</summary>
  
  1. https://letus.ed.tus.ac.jp/my/ にアクセスする
  
  2. 右上の「このページをカスタマイズする」を押す
  
  3. どこかに「ブロックを追加する」が現れるので、「テキスト」を押す  
     <img width="256px" src="https://github.com/yawarakacream/better-letus-dashboard/assets/70136871/fd09a0f6-5e40-4a16-867f-0d676e85b5db">  

  4. どこかに「(新しいテキストブロック)」が現れるので、歯車をクリックして「(新しいテキストブロック) ブロックを設定する」を押す  
     <img width="384px" src="https://github.com/yawarakacream/better-letus-dashboard/assets/70136871/5a41c865-acd3-4445-8d43-8ecb915be62a">  

  5. 「テキストブロックタイトル」「コンテンツ」を以下のように書く  
     「コンテンツ」を書く際は、**「\</\>」を押し**、元々書かれている `<p dir="ltr" style="text-align: left;"><br></p>` を消す  
     <img width="384px" src="https://github.com/yawarakacream/better-letus-dashboard/assets/70136871/a5a44590-99b5-4263-9c9b-888ec2ae5065">  

  6. `<script>` と `</script>` の間に <a href="https://github.com/yawarakacream/Better-LETUS-Dashboard/blob/main/main.js">main.js</a> を貼り付ける  
     <img width="384px" src="https://github.com/yawarakacream/better-letus-dashboard/assets/70136871/93a71a44-c665-402e-bb2a-00a3ba8c9b39">  

  7. 各種設定を自分の時間割等に合わせて変更する
  
  8. 下部の「変更を保存する」を押す
  
  9. ダッシュボードに戻るので、右上の「このページのカスタマイズを終了する」を押す
  
  ＊ 「カスタマイズを終了する」の後 https://letus.ed.tus.ac.jp/my/index.php にリダイレクトするが、ここでは本スクリプトは動作しないので、自分で https://letus.ed.tus.ac.jp/my/ に移動する
</details>

### Violentmonkey
<details>
  <summary>スポイラー</summary>
  
  1. Chrome に [Violentmonkey](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag) を入れる
  
  2. https://letus.ed.tus.ac.jp/my/ にアクセスする

  3. 拡張機能のメニューを開く  
  <img width="256px" src="https://user-images.githubusercontent.com/70136871/114344209-5ea3e400-9b9a-11eb-8e47-c0bed0d5db8b.png">

  4. 「新しいスクリプトを作成」を押す  
  <img width="256px" src="https://user-images.githubusercontent.com/70136871/114344279-7da27600-9b9a-11eb-8f31-d6fcc7403bc1.png">

  5. [main.js](https://github.com/yawarakacream/Better-LETUS-Dashboard/blob/main/main.js) を貼り付ける (元の 1 ~ 10 行はいらない)  
  <img width="256px" src="https://user-images.githubusercontent.com/70136871/114344378-ad517e00-9b9a-11eb-90f6-5955e12fe712.png">

  6. 各種設定を自分の時間割等に合わせて変更する

  7. 保存して閉じる
</details>

## 更新履歴

### v20240225

- 2024 年度用 初版

### v20230909

- 前期と後期の名称を first と second から spring と fall に変更
- タイムラインブロックの設定が保存されるようになったので、同設定の自動変更機能を削除

### v20230225

- 2023 年度用 初版

### v20220909

- 時間割表の行・列の表示切替を学期毎に設定できるように
- 時間割表の時間の列の幅が表示している学期によらず一定になるように

### v20220408

- コース名をシンプルにできるように

### v20220227

- 2022 年度用 初版

### 2021 年度用からの変更点

- 時間割にショートカット置き場を追加
- ~~タイムラインブロックの表示個数の設定の廃止に伴い、同設定の自動変更機能を削除~~
  - 廃止されてなかった...

## 注意事項

安全のための制限として、以下の条件をすべてクリアしていなければ動作しない：

- 本スクリプトの開発年度と LETUS の年度が合わなければならない
- `location.href` が https://letus.ed.tus.ac.jp/my/ と完全一致する
- LETUS 側のカスタマイズ機能を使用中ではない

利用は自己責任です
