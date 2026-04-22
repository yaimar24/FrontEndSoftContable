import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

function cspPlugin(): PluginOption {
  return {
    name: 'html-csp',
    transformIndexHtml(html, ctx) {
      const isDev = ctx.server != null
      const connectSrc = isDev
        ? "'self' http://localhost:* https://localhost:*"
        : "'self' https://sicpie.com"
      const csp = [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self'",
        `connect-src ${connectSrc}`,
        "frame-src 'none'",
        "object-src 'none'",
      ].join('; ')
      return html.replace(
        '<!--csp-meta-->',
        `<meta http-equiv="Content-Security-Policy" content="${csp};" />`,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), cspPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/uploads': {
        target: 'https://localhost:7260',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})