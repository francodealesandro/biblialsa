
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/biblialsa/',
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      manifest: {
        name: 'Biblia LSA',
        short_name: 'BibliaLSA',
        description: 'Biblia en Lengua de Señas Argentina (LSA)',
        start_url: '/biblialsa/',
        scope: '/biblialsa/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1976d2',
        icons: [
          {
            src: '/biblialsa/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          },
          {
            src: '/biblialsa/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/biblialsa/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,json}']
      }
    })
  ],
})
