const { configure } = require('quasar/wrappers')

module.exports = configure(function (/* ctx */) {
  return {
    boot: ['axios', 'firebase'],

    css: ['app.scss'],

    extras: [
      'roboto-font',
      'material-icons'
    ],

    build: {
      vueRouterMode: 'history'
    },

    devServer: {
      open: true,
      port: 8080
    },

    framework: {
      config: {},
      iconSet: 'material-icons',
      lang: 'en-US',
      plugins: ['Loading', 'Notify', 'Dialog']
    },

    animations: 'all',

    eslint: {
      warnings: true,
      errors: true
    },

    ssr: {
      pwa: false
    },

    pwa: {
      workboxMode: 'generateSW',
      manifest: {
        name: 'Stock App',
        short_name: 'Stock App',
        description: 'An app for management of stock of products.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          { src: 'icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-256x256.png', sizes: '256x256', type: 'image/png' },
          { src: 'icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    }
  }
})
