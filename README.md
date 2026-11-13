# 同事送別電子賀卡 🌸

七位同事的日系動畫合照，加上大家共同寫下的祝福。

## 使用前重要提醒
**目前 GitHub Pages 版本只供預覽，不會跨裝置同步留言。請不要把預覽頁當作正式填寫網址。** 真正收集祝福需要 Google Apps Script + Google 試算表。

## 正式收集留言（推薦）

1. 到 https://script.google.com/home/projects/create 建立 Apps Script 專案。
2. 將本專案 [Code.gs](./Code.gs) 的完整內容貼到 `程式碼.gs`。
3. 左邊「檔案」按「＋」→「HTML」→ 名稱輸入 `Index`，貼上 [Index.html](./Index.html) 的完整內容。
4. 儲存後，從函式選單執行一次 `setup`，同意 Google 授權。會自動建立「同事送別電子賀卡－祝福留言」試算表。
5. 「部署」→「新增部署作業」→ 選「網頁應用程式」，執行身分選「我」，存取權選「所有人」，再部署。
6. 使用無痕視窗測試送出祝福、重新讀取並查看試算表，確認留言已儲存。
7. 將部署後的網址發給同事填寫；把 **同一個網址加上 `?view=card`** 傳給離職同事看完整卡片。

### 兩個網址
- 同事填寫：`https://script.google.com/macros/s/部署ID/exec`
- 收卡連結：`https://script.google.com/macros/s/部署ID/exec?view=card`

## 資料及隱私
- GitHub 公開庫包含動畫化合照，任何人都可能查看，請確認合照中的同事同意。
- 祝福內容保存在你自己的 Google 試算表，不在 GitHub 程式碼裡。
- 同事填寫時不必登入；知道正式網址的人可以填寫或讀取賀卡。
- 請勿把 Google API 金鑰、私人留言表匯出檔案、密碼上傳公開倉庫。
- GitHub Pages 靜態預覽僅在目前瀏覽器儲存示範留言，**不會跨裝置同步**。

## 專案檔案
- `index.html`：GitHub Pages 靜態預覽（非正式填寫）。
- `Index.html`：貼到 Google Apps Script 的完整卡片畫面（動畫合照已內嵌）。
- `Code.gs`：儲存留言與取得卡片資料的 Apps Script 後端。
