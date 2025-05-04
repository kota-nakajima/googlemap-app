import { defineConfig, loadEnv, ConfigEnv } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    base: env.VITE_BASE_URL,
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
      strictPort: true,
      watch: { usePolling: true },
      proxy: {
        // /api/** を PHP-FPM が動く 8080 に転送
        '/api': {
          target: 'http://api:80',
          changeOrigin: true,
          secure: false,
        }
      }
    },
  }})

