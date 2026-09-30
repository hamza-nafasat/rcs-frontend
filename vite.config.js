import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        // serve pdf worker as .js
        assetFileNames: (asset) =>
          asset.names?.[0]?.endsWith(".mjs") ? "assets/[name]-[hash].js" : "assets/[name]-[hash][extname]",
      },
    },
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
})
