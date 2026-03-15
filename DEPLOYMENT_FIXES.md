# 部署修復摘要

## 問題列表

### 問題 1：首頁出現 JavaScript 錯誤
**錯誤信息**：
```
index-BubFWcjK.js:8 Error
Uncaught Error: You cannot render a <Router> inside another <Router>
```

**根本原因**：
1. 在 `main.tsx` 中使用了 `BrowserRouter` 
2. 在 `App.tsx` 中又使用了 `Router`
3. 資源路徑不正確（使用相對路徑而不是帶基本路徑的路徑）

### 問題 2：年份頁面 Archive 顯示錯誤且有 404 錯誤
**錯誤信息**：
```
1987:1  Failed to load resource: the server responded with a status of 404 ()
```

**根本原因**：
- DataManager 中的 fetch 調用缺少錯誤處理
- 資源加載失敗導致不完整的數據

## 已應用的修復

### 修復 1: 移除 `App.tsx` 中的重複 Router
**文件**: `src/App.tsx`

**更改**:
```tsx
// 之前
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>...</Routes>
    </Router>
  );
}

// 之後
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="relative min-h-screen">
      <Routes>...</Routes>
    </div>
  );
}
```

### 修復 2: 在 DataManager 中添加動態基本路徑檢測
**文件**: `src/DataManager.ts`

**新增方法**:
```typescript
private static getBasePath(): string {
  const pathname = window.location.pathname;
  if (pathname.includes('/tw_tj_leg/')) {
    return '/tw_tj_leg/';
  }
  return '/';
}
```

**應用到所有 fetch 調用**:
- ✅ `id_mapping.json` → `${this.getBasePath()}id_mapping.json`
- ✅ `ai_output_id_pdf_page_image_map.json` → `${this.getBasePath()}ai_output_id_pdf_page_image_map.json`
- ✅ `imgbb_map.json` → `${this.getBasePath()}imgbb_map.json`
- ✅ `PDF_List_Full.json` → `${this.getBasePath()}PDF_List_Full.json`
- ✅ 年份數據 → `${this.getBasePath()}${year}.json`

### 修復 3: 改進 DataManager 中的錯誤處理
**文件**: `src/DataManager.ts`

**改進內容**:
```typescript
static async init() {
  if (!this.idMapping) {
    try {
      const resp = await fetch(`${this.getBasePath()}id_mapping.json`);
      if (resp.ok) {
        this.idMapping = await resp.json();
      } else {
        console.error("Failed to load id_mapping.json");
        this.idMapping = {};
      }
    } catch (e) {
      console.error("Error loading id_mapping.json:", e);
      this.idMapping = {};
    }
  }
  // ... 類似的錯誤處理用於其他 fetch 調用
}
```

### 修復 4: 在 Landing.tsx 和 YearOverview.tsx 中使用動態基本路徑
**文件**: `src/pages/Landing.tsx` 和 `src/pages/YearOverview.tsx`

**新增函數**:
```typescript
const getBasePath = (): string => {
  const pathname = window.location.pathname;
  if (pathname.includes('/tw_tj_leg/')) {
    return '/tw_tj_leg/';
  }
  return '/';
};
```

**應用到 useEffect 中的 fetch 調用**:
```typescript
const basePath = getBasePath();
fetch(`${basePath}${year}.json`)
fetch(`${basePath}summary/${year}.json`)
```

## 構建和部署

### 本地測試
```bash
# 1. 清理舊的構建
rm -r dist

# 2. 重新構建
npm run build

# 3. 啟動測試伺服器
node server.cjs

# 4. 訪問 http://localhost:3000/tw_tj_leg/
```

### 生產部署
1. 執行 `npm run build`
2. 上傳 `dist/` 目錄到 Gamepad 服務器
3. 確保伺服器配置為 SPA 路由支持（所有 404 重定向到 index.html）

## 測試清單

✅ 首頁成功加載，無 Router 衝突錯誤
✅ 導航到年份頁面正常工作
✅ Guide 標籤頁面顯示正確的內容
✅ Archive 標籤頁面顯示正確的數據
✅ 所有 JSON 文件加載成功（不再出現 404 錯誤）
✅ 錯誤處理已改進，缺失的資源不會導致應用崩潰

## 構建輸出

```
dist/index.html                   0.87 kB │ gzip:   0.53 kB
dist/assets/index-*.css           46.69 kB │ gzip:   8.18 kB
dist/assets/index-*.js            823.89 kB │ gzip: 234.83 kB
```

## 注意事項

1. **BrowserRouter basename**：已在 `main.tsx` 中設置為 `/tw_tj_leg`，確保路由在子路徑下正常工作
2. **資源路徑**：使用動態 `getBasePath()` 方法確保在任何基本路徑下都能正確加載資源
3. **錯誤處理**：添加了 try-catch 和響應驗證，防止缺失的資源導致應用崩潰
4. **SPA 路由**：伺服器需要配置為將所有無法匹配的 URL 重定向到 `index.html`

## 後續優化建議

1. **代碼分割**：當前 JavaScript bundle 為 823 kB（已 gzip 壓縮為 235 kB），可考慮使用動態導入進行代碼分割
2. **緩存策略**：配置適當的緩存頭以減少帶寬使用
3. **CDN 加速**：將靜態資源部署到 CDN 以加快加載速度

