import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const SURFACE = '#F3F6F5'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset URLs, so the build works from any path (GitHub Pages serves it under /RC-DMTS2/).
  base: './',
  plugins: [
    react(),
    VitePWA({
      // A new version installs in the background and is used on the next launch.
      registerType: 'autoUpdate',
      // The manifest icons are already precached by globPatterns below.
      includeManifestIcons: false,
      manifest: {
        id: './',
        name: 'ANCHOR',
        short_name: 'ANCHOR',
        description: 'Accountability, Needs, and Coordination Hub for Operational Response',
        lang: 'en',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: SURFACE,
        theme_color: SURFACE,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Everything the app needs is precached, so it opens and runs with no signal.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
})
