const CACHE_NAME = 'camara-pwa-v1'
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
]
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Cache opened')
      // Cachear archivos individualmente para mejor manejo de errores
      return Promise.all(
        urlsToCache.map(function (url) {
          return cache.add(url).catch(function (error) {
            console.error('Failed to cache:', url, error)
            // No detenemos la instalación si un archivo falla
            return null
          })
        })
      )
    })
  )
  // Activar el service worker inmediatamente
  self.skipWaiting()
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response
      }
      return fetch(event.request)
    })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      ).then(function () {
        // Tomar control de todas las páginas inmediatamente
        return self.clients.claim()
      })
    })
  )
})
