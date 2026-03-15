# 快速部署指南

## 一分鐘快速總結

### 什麼被修復了？
✅ 路由衝突（移除重複 Router）
✅ 資源加載失敗（動態基本路徑）
✅ 缺失的錯誤處理（改進的 try-catch）

### 如何部署？
```bash
npm run build
# 上傳 dist/ 文件夾到伺服器
# 配置 Web 伺服器以支持 SPA 路由
```

## 修改的文件

| 文件 | 修改內容 |
|------|--------|
| `src/App.tsx` | 移除重複的 Router 組件 |
| `src/DataManager.ts` | 添加 getBasePath() 方法，改進所有 fetch 調用 |
| `src/pages/Landing.tsx` | 添加動態基本路徑檢測 |
| `src/pages/YearOverview.tsx` | 添加動態基本路徑檢測 |

## 本地測試命令

```bash
# 開發模式
npm run dev

# 生產構建
npm run build

# 本地伺服器測試
node server.cjs
# 訪問 http://localhost:3000/tw_tj_leg/
```

## Nginx 配置（複製粘貼）

```nginx
server {
    listen 80;
    server_name your-gamepad-server;
    
    location /tw_tj_leg/ {
        alias /path/to/tw_tj_leg/dist/;
        try_files $uri $uri/ /tw_tj_leg/index.html;
        
        # 緩存設置
        location ~ \.html$ {
            expires -1;
        }
        location ~ \.(js|css|json|png|jpg|svg)$ {
            expires 30d;
        }
    }
}
```

## 測試清單

- [ ] npm run build 成功完成
- [ ] dist/ 文件夾已生成
- [ ] 文件已上傳到伺服器
- [ ] 訪問首頁無錯誤
- [ ] 可以導航到年份頁面
- [ ] Console 中無紅色錯誤信息
- [ ] Network 標籤中無 404 錯誤

## 常見問題

**Q: 首頁顯示 404？**
A: 配置 SPA 路由支持（所有 404 → index.html）

**Q: JSON 文件無法加載？**
A: 檢查文件是否在正確路徑（dist/1987.json 等）

**Q: 應用加載很慢？**
A: 啟用 Gzip 壓縮，使用 CDN

## 聯繫

有問題？查看詳細文檔：
- `DEPLOYMENT_FIXES.md` - 完整修復說明
- `DEPLOYMENT_CHECKLIST.md` - 完整檢查清單
