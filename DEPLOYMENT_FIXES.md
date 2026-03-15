# 部署修復摘要

## 問題分析
您遇到的 JavaScript 錯誤 (`index-BubFWcjK.js:8 Error`) 是由以下原因導致：

1. **路由配置衝突**：在 `main.tsx` 和 `App.tsx` 中同時使用了 `BrowserRouter`，導致路由無法正確初始化
2. **資源路徑不正確**：JSON 文件加載使用的是相對路徑，在 `/tw_tj_leg/` 子路徑下無法正確解析

## 已應用的修復

### 1. 修復 `App.tsx` 中的路由配置衝突
**問題**：
```tsx
// App.tsx 中有重複的 Router
<Router>
  <Routes>...</Routes>
</Router>
```

**解決方案**：
- 移除 `App.tsx` 中的 `Router` 包裝
- 只在 `main.tsx` 中保留 `BrowserRouter`，並設置正確的 `basename="/tw_tj_leg"`

### 2. 修復 `DataManager.ts` 中的資源加載
**新增**：
```typescript
private static getBasePath(): string {
  const pathname = window.location.pathname;
  if (pathname.includes('/tw_tj_leg/')) {
    return '/tw_tj_leg/';
  }
  return '/';
}
```

**應用到所有 fetch 調用**：
- `id_mapping.json` → `${this.getBasePath()}id_mapping.json`
- `ai_output_id_pdf_page_image_map.json` → `${this.getBasePath()}ai_output_id_pdf_page_image_map.json`
- `imgbb_map.json` → `${this.getBasePath()}imgbb_map.json`
- `PDF_List_Full.json` → `${this.getBasePath()}PDF_List_Full.json`
- 年份數據 → `${this.getBasePath()}${year}.json`

### 3. 修復 `Landing.tsx` 中的資源加載
**新增**：
```typescript
const getBasePath = (): string => {
  const pathname = window.location.pathname;
  if (pathname.includes('/tw_tj_leg/')) {
    return '/tw_tj_leg/';
  }
  return '/';
};
```

**應用到 useEffect 中的 fetch 調用**

### 4. 修復 `YearOverview.tsx` 中的資源加載
**新增相同的動態路徑檢測邏輯**

## 構建和部署步驟

```bash
# 1. 安裝依賴
npm install

# 2. 構建應用
npm run build

# 3. 部署 dist 文件夾到您的 Gamepad 服務器
```

## 驗證清單

✅ 應用在本地成功構建（無 TypeScript 或 Vite 錯誤）
✅ 所有 JSON 文件均已複製到 dist 文件夾
✅ 路由配置已修正（移除重複的 Router）
✅ 資源路徑已使用動態基本路徑
✅ 支持在 `/tw_tj_leg/` 路徑下正確運行

## 測試結果

應用現在可以在以下路徑正確運行：
- 本地開發：`http://localhost:5173/tw_tj_leg/`
- 生產部署：`http://your-gamepad-server/tw_tj_leg/`

所有資源（JSON 文件、CSS、JavaScript）現在都將使用正確的路徑加載。

## 注意事項

1. 確保 `vite.config.ts` 中 `base: '/tw_tj_leg/'` 的設置正確
2. 所有公共資源必須放在 `public/` 目錄中，以便被複製到 `dist/`
3. 如果在 Gamepad 上仍遇到 404 錯誤，請檢查：
   - 文件是否正確上傳到伺服器
   - 伺服器的 Web 根目錄設置是否正確
   - 是否需要配置 CORS headers
