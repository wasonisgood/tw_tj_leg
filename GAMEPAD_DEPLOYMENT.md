# Gamepad 部署指南

## 部署步驟

### 1. 本地構建
```bash
# 在項目根目錄執行
cd c:\Users\user\code\tw_tj_leg
npm install
npm run build
```

構建完成後，所有文件將在 `dist/` 目錄中。

### 2. 上傳到 Gamepad

使用 GitHub Actions 或手動上傳，確保上傳以下內容：

```
dist/
├── index.html
├── assets/
│   ├── index-*.css
│   └── index-*.js
├── 1987.json
├── 1992.json
├── ... (其他年份 JSON)
├── id_mapping.json
├── ai_output_id_pdf_page_image_map.json
├── imgbb_map.json
├── PDF_List_Full.json
└── summary/
    ├── 1987.json
    ├── 1992.json
    └── ... (其他年份摘要 JSON)
```

### 3. 配置 Web 服務器

Gamepad 服務器需要配置為：
- 將所有 404 響應重定向到 `/tw_tj_leg/index.html`（用於 SPA 路由）
- 設置正確的 MIME 類型
- 不要緩存 HTML 文件（或設置短緩存期限）

**Nginx 配置示例**：
```nginx
location /tw_tj_leg/ {
    try_files $uri $uri/ /tw_tj_leg/index.html;
    expires 1d;
}

# 不緩存 HTML
location ~ \.html$ {
    expires -1;
}

# 緩存資源文件
location ~ \.(js|css|json)$ {
    expires 30d;
}
```

**Apache 配置示例**：
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

### 4. 驗證部署

部署完成後，訪問以下 URL：
- `http://your-gamepad-server/tw_tj_leg/` - 應顯示首頁
- 打開瀏覽器開發者工具 (F12)
- 檢查主控台是否有任何錯誤
- 檢查網路選項卡確認所有 JSON 文件返回 200 狀態碼

## 常見問題排除

### 問題 1：首頁出現 404 錯誤
**原因**：Web 伺服器未配置 SPA 路由
**解決方案**：按照上面的 Nginx/Apache 配置進行設置

### 問題 2：JSON 文件返回 404
**原因**：文件未上傳或路徑不正確
**解決方案**：確認 `dist/` 目錄中所有 JSON 文件都已上傳到正確位置

### 問題 3：CSS/JS 文件無法加載
**原因**：`vite.config.ts` 中 `base` 設置不正確
**解決方案**：確認 `base: '/tw_tj_leg/'` 在 vite.config.ts 中正確設置

### 問題 4：頁面加載緩慢
**原因**：大的 JavaScript bundle（823 kB）
**解決方案**：使用動態導入和代碼分割來優化性能

## 構建大小優化（可選）

如果遇到性能問題，可考慮：

1. 啟用 Gzip 壓縮（已優化為 234 kB）
2. 使用 CDN 加速資源加載
3. 代碼分割（在 `vite.config.ts` 中配置 `build.rolldownOptions.output.codeSplitting`）

## 回滾計劃

如果新版本有問題：
1. 備份當前的 `dist/` 目錄
2. 恢復上一個已知的好版本
3. 重新測試部署

## 支持

如遇到任何問題，請查看 `DEPLOYMENT_FIXES.md` 了解最近的修復詳情。
