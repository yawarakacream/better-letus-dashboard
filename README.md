# Better LETUS Dashboard 2022

LETUS のダッシュボードを改良する User Script

開発環境  
Chrome [Violentmonkey](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag) 2.13.0

ダッシュボード「HTML ブロック」内 <script> にコピペすることでも使用可能

## 機能

### 上部に時間割を追加する

<img width="1097" src="https://user-images.githubusercontent.com/70136871/155876260-b6eed26a-bd7f-4381-a7e1-c173bec6d764.png">

前期・後期を切り替えられる

下部に時間割に載らない集中講義等のショートカットを配置可能

### 「タイムライン」ブロックの設定を自動的に変更する

デフォルトでは、タイムラインに表示される課題等が 7 日 と短い & 変更しても保存してくれない  
これらの設定をダッシュボードを開いたときに自動的に変更する

## 導入方法

HTML ブロック の方を推奨  
この方法だと携帯版でも動作する

### HTML ブロック
<details>
  <summary>スポイラー</summary>
  
  1. https://letus.ed.tus.ac.jp/my/ にアクセスする
  
  2. 右上の「このページをカスタマイズする」を選択
  
  3. どこかに「ブロックを追加する」が現れるので、HTML を選択  
  <img width="256px" src="https://user-images.githubusercontent.com/70136871/114413509-021be580-9be9-11eb-8da0-2e9ac9bca2e6.png">
  
  4. どこかに「(新しい HTML ブロック)」が現れるので、歯車をクリックして「(新しい HTML ブロック) ブロックを設定する」を選択
  <img width="256px" src="https://user-images.githubusercontent.com/70136871/114413827-4ad39e80-9be9-11eb-8bde-cbd20b9b1a0c.png">
  
  5. 「HTMLブロックタイトル」「コンテンツ」を以下のように書く  
  <b>「コンテンツ」の \</\> 部分を必ず押す！</b>  
  元々「\<p dir="ltr" style="text-align: left;"\>\<br\>\</p\>」などと書かれているので、これは消す
  <img width="256px" src="https://user-images.githubusercontent.com/70136871/114414450-c897aa00-9be9-11eb-8b03-f0c13e8eb180.png">
  
  6. <script> と </script> の間に <a href="https://github.com/yawarakacream/Better-LETUS-Dashboard/blob/main/main.js">main.js</a> を貼り付ける  
  <img width="256px" src="https://user-images.githubusercontent.com/70136871/114415080-54a9d180-9bea-11eb-961f-82b606fb1c57.png">
  
  7. 14 行目以降の各種設定を自分の時間割等に合わせて変更する
  
  8. 下部の「変更を保存する」を選択
  
  9. ダッシュボードに戻るので、右上の「このページのカスタマイズを終了する」を選択
  
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

  6. 13 行目以降の各種設定を自分の時間割等に合わせて変更する
</details>

## 更新履歴

### v20220408

- コース名をシンプルにできるように

### v20220227

- 2022 年度用 初版

### 2021 年度用からの変更点

- タイムラインブロックの表示個数の設定の廃止に伴い、同設定の自動変更機能を削除
- 時間割にショートカット置き場を追加

## 注意事項

安全のための制限として、以下の条件をすべてクリアしていなければ動作しない：

- 年度が合わなければならない
- location.href が https://letus.ed.tus.ac.jp/my/ と完全一致する
- LETUS 側のカスタマイズ機能を使用中ではない

利用は自己責任です
