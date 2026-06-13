import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Bayani Adventures',
        short_name: 'Bayani',
        description: 'A magical educational adventure for kids!',
        theme_color: '#87CEEB',
        background_color: '#4CAF50',
        display: 'fullscreen',
        orientation: 'landscape',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/app_icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    host: true, // Listen on all network interfaces
    allowedHosts: true // Fix for ngrok 'Invalid Host header' / 'Blocked host' errors
  }
})
