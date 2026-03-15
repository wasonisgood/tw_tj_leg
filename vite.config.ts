import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 禁用 HMR 覆蓋層以避免某些進程衝突
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    // 強制重新預構建依賴
    force: true
  }
})
