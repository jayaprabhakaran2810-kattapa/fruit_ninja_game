import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  optimizeDeps: {
    exclude: ['@mediapipe/hands', '@mediapipe/camera_utils']
  },
  build: {
    commonjsOptions: {
      exclude: ['@mediapipe/hands', '@mediapipe/camera_utils']
    }
  }
})