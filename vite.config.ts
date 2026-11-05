import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 项目站点：https://stu-ms.github.io/2048/
export default defineConfig({
  base: '/2048/',
  plugins: [react()],
})
