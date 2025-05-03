import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    watch: { usePolling: true },
    proxy: {
      // /api/** を PHP-FPM が動く 8080 に転送
      '/api': {
        target: 'http://host.docker.internal:8081',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
