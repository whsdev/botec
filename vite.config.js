import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // IMPORTANT: Set this to your GitHub Repository name.
  // If your URL is https://username.github.io/botec-app/
  // Then the base should be '/botec-app/'
  base: './', 
  
  build: {
    outDir: 'dist',
    // This ensures assets like images are bundled correctly
    assetsDir: 'assets',
  }
})