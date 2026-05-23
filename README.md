# 永續城市論壇 2026 活動網站

以 Vue 3 + Vite 建置的單頁活動官網，包含活動資訊、講者、議程、交通、精彩回顧與報名表單。

## 技術棧

- Vue 3
- Vite 6
- Tailwind CSS 4（透過 `@tailwindcss/vite`）
- Sass
- A
- v-slick-carousel

## 環境需求

- Node.js 18+（建議使用 LTS）
- npm 9+

## 開發指令

安裝套件：

```bash
npm install
```

啟動開發伺服器：

```bash
npm run dev
```

打包正式版：

```bash
npm run build
```

本機預覽正式版：

```bash
npm run preview
```

## 專案結構

```text
SDGsforum/
├─ .pages.yml                 # Pages CMS no-code 後台設定
├─ src/
│  ├─ assets/
│  │  ├─ image/              # 網站圖片素材
│  │  └─ json/               # 頁面內容資料（info / speaker）
│  ├─ components/            # 各區塊 Vue 元件
│  ├─ App.vue                # 首頁組裝
│  ├─ main.js                # 入口
│  └─ style.css
├─ public/
├─ index.html
├─ vite.config.js
└─ package.json
```

## 內容維護方式

主要內容以 JSON 管理，不需改 Vue 程式即可更新文案與前台 UI 內容：

- `src/assets/json/info.json`
- `src/assets/json/speaker.json`

範例檔：

- `src/assets/json/info_example.json`
- `src/assets/json/speaker_example.json`

## No-code 後台編輯

本專案已加入 Pages CMS 設定檔：

- `.pages.yml`

後台用途僅限編輯前台 UI 內容，例如 Header 選單、論壇前言、論壇資訊、議程、講者、報名區文字、交通資訊、合作單位與 Footer。報名資料仍由既有報名 API 處理，不會存進 GitHub。

使用方式：

1. 前往 `https://app.pagescms.org/`
2. 使用 GitHub 登入
3. 安裝 Pages CMS GitHub App 到 `jackietsairock/SDGsforum`
4. 進入 repository 後即可編輯 `網站 UI 內容` 與 `講者內容`
5. 儲存後 Pages CMS 會把 JSON 變更 commit 回 GitHub，再由原本部署流程重新打包網站

注意：

- 後台圖片會寫入 `src/assets/image/`。
- 報名表欄位的 `inputName` 會影響送到後端 API 的欄位名稱，未同步調整後端時不要任意修改。
- `content` 內的 `cmsType` 是後台與前台對應區塊用的固定值，請保留。

## 報名表單 API

報名送出位於：

- `src/components/SignUp.vue`

目前串接：

- `https://events.businesstoday.com.tw/backend/HRforum2026/sign_up`

如需切換環境，請更新 `SignUp.vue` 內 `sign_up()` 的 `url`。

## 部署注意事項

`vite.config.js` 內已設定：

- 開發環境 `base: "/"`  
- 正式環境 `base: "/2026/SDGsforum/"`

正式部署時請確認站點掛載路徑與 `base` 一致，否則靜態資源路徑會錯誤。

## 其他備註

- 專案目前無測試框架（Jest / Vitest）與 lint 流程。
- `dist/` 為打包輸出資料夾。
