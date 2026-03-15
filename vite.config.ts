import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/tw_tj_leg/', // 明確設定 GitHub Pages 儲存庫名稱
  server: {
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    force: true
  }
})
