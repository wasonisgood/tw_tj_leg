# Archive 和圖像顯示問題修復摘要

## 問題描述

1. **Archive 頁面顯示奇怪的 ID 而不是法案名稱** ❌
   - Table of Contents 中出現的是 ID 而不是法案名稱
   - Archive 中各法案部分的標題也是奇怪的 ID

2. **法案分組跳轉不工作** ❌
   - 無法通過 Table of Contents 導航到正確的法案部分

3. **圖像無法顯示或出現錯誤** ❌
   - 發言詳細頁面中的圖像無法加載

## 根本原因分析

### 問題 1：lawName 來源錯誤
**原因**：
- `DataManager.ts` 中的 `parseId` 方法試圖通過分割 ID 字符串（`spk-1987-741ff437ab88a946`）來提取法案名稱
- 但實際的 ID 格式是 `cleanId-date-uniquehash`，不包含法案名稱

**解決方案**：
- 法案名稱（`file_stem`）應該從 `id_mapping.json` 中的 `file_stem` 欄位獲取
- 例如：`"威權時期回復條例_第1次修正_20241113_委員會審查"`

### 問題 2：圖像文件名處理
**原因**：
- `imagePaths` 中的文件名需要與 `imgbb_map.json` 中的鍵完全匹配
- 例如：`imgbb_map.json` 中的鍵是 `"spk-1987-0d7e3ee6b90ef827.png"`
- 從 `ai_output_id_pdf_page_image_map.json` 中的路徑提取文件名時需要確保格式正確

## 已應用的修復

### 修復 1：使用正確的 lawName 來源
**文件**：`src/DataManager.ts`

**更改**：
```typescript
// 之前（錯誤）
const info = this.parseId(cleanId);
lawName: info.lawName,

// 之後（正確）
const lawName = meta?.file_stem || '未知法案';
// ...
lawName: lawName,
```

### 修復 2：移除錯誤的 parseId 方法
**文件**：`src/DataManager.ts`

**移除**：
```typescript
private static parseId(id: string) {
  const parts = id.split('_');
  return {
    lawName: parts[0] || '未知法案',
    action: parts[1] || '',
    date: parts[2] || '',
    stage: parts[3] || '一般會議'
  };
}
```

### 修復 3：改進圖像文件名提取
**文件**：`src/DataManager.ts`

**更改**：
```typescript
let imagePaths: string[] = [];
if (this.imageMap[cleanId]) {
  const paths = this.imageMap[cleanId] as string[];
  imagePaths = paths.map(p => {
    // 從完整路徑提取文件名
    const parts = p.split('/');
    const fileName = parts[parts.length - 1];
    return fileName;
  });
}

// 如果沒有圖像，添加默認的文件名以供後續查詢
if (imagePaths.length === 0) {
  imagePaths = [`spk-${cleanId}.png`];
}
```

## 數據映射流程（已修正）

1. **從年份 JSON 讀取**：`1987.json` → ID 為 `spk-1987-0d7e3ee6b90ef827`

2. **清理 ID**：`spk-1987-0d7e3ee6b90ef827` → `1987-0d7e3ee6b90ef827`

3. **查詢 id_mapping**：在 `id_mapping.json` 中查詢 `1987-0d7e3ee6b90ef827`
   ```json
   {
     "file_stem": "動員戡亂時期國家安全法草案_1987年_委員會審查",
     "date": "19870624",
     "image_paths": [
       "...mapped_page_images/spk-1987-0d7e3ee6b90ef827_p1.png",
       "...mapped_page_images/spk-1987-0d7e3ee6b90ef827_p2.png"
     ]
   }
   ```

4. **提取文件名**：
   - 從路徑中提取：`spk-1987-0d7e3ee6b90ef827_p1.png`
   - 或使用默認：`spk-1987-0d7e3ee6b90ef827.png`

5. **查詢 imgbb_map**：在 `imgbb_map.json` 中查詢文件名
   ```json
   {
     "spk-1987-0d7e3ee6b90ef827.png": "https://i.ibb.co/Jj0mYFMf/spk-1987-0d7e3ee6b90ef827.png"
   }
   ```

6. **顯示圖像**：使用 ImgBB URL 在頁面中顯示圖像

## 測試結果

✅ Archive 頁面現在正確顯示法案名稱（例如 `"動員戡亂時期國家安全法草案_1987年_委員會審查"`）
✅ Table of Contents 可以正確分組和導航
✅ 圖像路徑正確映射到 ImgBB URL
✅ 發言詳細頁面可以正確加載並顯示圖像

## 構建信息

```
dist/index.html                   0.87 kB │ gzip:   0.53 kB
dist/assets/index-DK7H88_m.css   46.69 kB │ gzip:   8.18 kB
dist/assets/index-DdWOSLro.js   823.78 kB │ gzip: 234.78 kB
```

## 後續建議

1. **性能優化**：考慮實現圖像懶加載，減少初始加載時間
2. **錯誤處理**：添加圖像加載失敗的備用顯示
3. **快取策略**：在客戶端快取圖像 URL，減少重複查詢
