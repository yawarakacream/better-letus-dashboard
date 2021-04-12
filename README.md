# Better-LETUS-Dashboard

LETUS のダッシュボードを改良する User Script

開発環境  
Chrome [Violentmonkey](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag) 2.12.12

ダッシュボード「HTML ブロック」内 <script> にコピペすることでも使用可能

## 機能

### 上部に時間割を追加する

![Screenshot](https://user-images.githubusercontent.com/70136871/114332531-61460f80-9b81-11eb-8fc3-b461adca3f69.png)

### 「タイムライン」ブロックの設定を自動的に変更する

デフォルトでは、タイムラインに表示される課題等が 7 日 & 5 個と少ない & 変更しても保存してくれない  
これらの設定をダッシュボードを開いたときに自動的に変更する

## 導入方法

### HTML ブロック (推奨) v202104-1.1 ~
<details>
  <summary>スポイラー</summary>
  
  1. https://letus.ed.tus.ac.jp/my/ にアクセスする
  
  2. 左上の「このページをカスタマイズする」を選択
  
  3. どこかに「ブロックを追加する」が現れるので、HTML を選択  
  <img width="256px" src="https://user-images.githubusercontent.com/70136871/114413509-021be580-9be9-11eb-8da0-2e9ac9bca2e6.png">
  
  4. どこかに「(新しい HTML ブロック)」が現れるので、歯車をクリックして「(新しい HTML ブロック) ブロックを設定する」を選択
  <img width="256px" src="https://user-images.githubusercontent.com/70136871/114413827-4ad39e80-9be9-11eb-8bde-cbd20b9b1a0c.png">
  
  5. 「HTMLブロックタイトル」「コンテンツ」を以下のように書く  
  <b>「コンテンツ」の \</\> 部分を必ず押す。</b>元々「\<p dir="ltr" style="text-align: left;"\>\<br\>\</p\>」などと書かれているので、これは消す
  <img width="256px" src="https://user-images.githubusercontent.com/70136871/114414450-c897aa00-9be9-11eb-8b03-f0c13e8eb180.png">
  
  6. <script> と </script> の間に [main.js](https://github.com/yawarakacream/Better-LETUS-Dashboard/blob/main/main.js) を貼り付ける  
  <img width="256px" src="https://user-images.githubusercontent.com/70136871/114415080-54a9d180-9bea-11eb-961f-82b606fb1c57.png">
  
  7. 14 行目以降の各種設定を自分の時間割等に合わせて変更する
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

## 注意事項

安全のための制限：

* https://letus.ed.tus.ac.jp/my/ と完全一致する場合のみ実行  
* LETUS 側のカスタマイズ機能使用中は動作しない

利用は自己責任です
