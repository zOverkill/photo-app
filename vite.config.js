import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      external: ['@capacitor/core', '@capacitor/camera', '@capacitor/filesystem', '@capacitor/storage']
    }
  }
})