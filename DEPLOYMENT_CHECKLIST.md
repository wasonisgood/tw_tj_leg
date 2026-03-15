# 部署前最終檢查清單

## ✅ 代碼修復

- [x] 移除 `App.tsx` 中的重複 Router
- [x] 在 `DataManager.ts` 中添加 `getBasePath()` 方法
- [x] 更新所有 fetch 調用以使用動態基本路徑
  - [x] `id_mapping.json`
  - [x] `ai_output_id_pdf_page_image_map.json`
  - [x] `imgbb_map.json`
  - [x] `PDF_List_Full.json`
  - [x] 年份 JSON 文件
- [x] 改進 DataManager 中的錯誤處理
- [x] 在 Landing.tsx 和 YearOverview.tsx 中使用動態基本路徑

## ✅ 構建驗證

- [x] 應用成功構建（無錯誤）
- [x] dist 文件夾已生成
- [x] 所有 JSON 文件均已複製到 dist 文件夾
- [x] 資源大小在可接受範圍內

## ✅ 本地測試

- [x] 首頁成功加載
- [x] 無 Router 衝突錯誤
- [x] 可以導航到年份頁面
- [x] Guide 標籤顯示正確的內容
- [x] Archive 標籤顯示正確的數據
- [x] 所有 JSON 文件成功加載

## 🚀 部署步驟

### 1. 最終構建
```bash
cd c:\Users\user\code\tw_tj_leg
npm install  # 確保所有依賴已安裝
npm run build  # 構建生產版本
```

### 2. 上傳到 Gamepad 服務器

上傳 `dist/` 目錄中的所有文件到 Gamepad 服務器的 `/tw_tj_leg/` 路徑下。

確保上傳以下內容：
- `index.html`
- `assets/` 文件夾（包含 CSS 和 JavaScript 文件）
- 所有 `.json` 文件（年份、id_mapping、ai_output_id_pdf_page_image_map、imgbb_map、PDF_List_Full）
- `summary/` 文件夾（包含所有年份的摘要 JSON）

### 3. 配置 Web 服務器

根據您的伺服器類型（Nginx、Apache 等），配置 SPA 路由支持。

**Nginx 示例**:
```nginx
location /tw_tj_leg/ {
    try_files $uri $uri/ /tw_tj_leg/index.html;
}
```

**Apache 示例**:
```apache
<Directory /path/to/tw_tj_leg>
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /tw_tj_leg/
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /tw_tj_leg/index.html [L]
    </IfModule>
</Directory>
```

### 4. 部署驗證

部署完成後，執行以下驗證：

1. 訪問 `http://your-gamepad-server/tw_tj_leg/`
   - 應該看到首頁加載完成

2. 點擊某個年份（如 1987）
   - 應該看到 Guide 標籤顯示內容
   - 應該看到 Archive 標籤顯示演講列表

3. 打開瀏覽器開發者工具 (F12)
   - Console 標籤：應該沒有錯誤信息
   - Network 標籤：
     - 所有 `.json` 文件應該返回 200 狀態碼
     - 沒有 404 錯誤

4. 測試導航
   - 點擊不同的年份
   - 點擊演講項目進入詳細頁面
   - 使用瀏覽器返回按鈕

## 🔧 故障排除

### 問題：首頁返回 404
**解決方案**：確保 Web 伺服器配置了 SPA 路由支持（所有 404 重定向到 index.html）

### 問題：JSON 文件返回 404
**解決方案**：確認文件已上傳到正確位置，並檢查路徑是否正確

### 問題：CSS/JavaScript 無法加載
**解決方案**：確認 vite.config.ts 中的 `base: '/tw_tj_leg/'` 設置正確

### 問題：頁面加載緩慢
**解決方案**：
- 檢查網絡連接
- 考慮啟用 Gzip 壓縮
- 使用 CDN 加速資源

## 📝 回滾計劃

如果新版本有問題：

1. 保存當前工作版本的備份
2. 恢復前一個已知的好版本
3. 通知用戶恢復完成
4. 分析問題並修復

## 📞 支持

如遇到任何問題，請查看：
- `DEPLOYMENT_FIXES.md` - 詳細的修復說明
- `GAMEPAD_DEPLOYMENT.md` - 部署指南
- 瀏覽器開發者工具（F12）- 查看具體的錯誤信息

## 完成標記

部署完成後，請標記以下項目：

- [ ] 所有文件已成功上傳
- [ ] Web 服務器已配置
- [ ] 首頁成功加載
- [ ] 所有年份頁面正常工作
- [ ] 沒有控制台錯誤
- [ ] 已測試返回按鈕和導航
- [ ] 已通知用戶新版本上線
