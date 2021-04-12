# Better-LETUS-Dashboard

LETUS のダッシュボードを改良する User Script

動作確認  
Chrome [Violentmonkey](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag) 2.12.12

## 機能

### 上部に時間割を追加する

![Screenshot](https://user-images.githubusercontent.com/70136871/114332531-61460f80-9b81-11eb-8fc3-b461adca3f69.png)

### 「タイムライン」ブロックの設定を自動的に変更する

デフォルトでは、タイムラインに表示される課題等が 7 日 & 5 個と少ない & 変更しても保存してくれない  
これらの設定をダッシュボードを開いたときに自動的に変更する

## よくわからない人への導入方法 (Chrome)

1. Chrome に [Violentmonkey](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag) を入れる
2. https://letus.ed.tus.ac.jp/my/ にアクセスする
3. 拡張機能のメニューを開く  
![スクリーンショット 2021-04-12 14 21 23](https://user-images.githubusercontent.com/70136871/114344209-5ea3e400-9b9a-11eb-8e47-c0bed0d5db8b.png)
4. 「新しいスクリプトを作成」を押す  
![スクリーンショット 2021-04-12 14 22 15](https://user-images.githubusercontent.com/70136871/114344279-7da27600-9b9a-11eb-8f31-d6fcc7403bc1.png)
5. [main.js](https://github.com/yawarakacream/Better-LETUS-Dashboard/blob/main/main.js) を貼り付ける (元の 1 ~ 10 行はいらない)  
![スクリーンショット 2021-04-12 14 23 34](https://user-images.githubusercontent.com/70136871/114344378-ad517e00-9b9a-11eb-90f6-5955e12fe712.png)
6. 13 行目以降の各種設定を自分の時間割等に合わせて変更する

## 注意事項

安全のための制限

* https://letus.ed.tus.ac.jp/my/ と完全一致する場合のみ実行  
* LETUS 側のカスタマイズ機能使用中は動作しない
