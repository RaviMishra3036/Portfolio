const IMAGE_CACHE = 'portfolio-images-v1';
const APP_CACHE = 'portfolio-app-v3';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(APP_CACHE).then((cache) => cache.add('/')));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames
        .filter((cacheName) => cacheName.startsWith('portfolio-app-') && cacheName !== APP_CACHE)
        .map((cacheName) => caches.delete(cacheName))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then((response) => {
        const copy = response.clone();
        void caches.open(APP_CACHE).then((cache) => cache.put(request, copy));
        return response;
      }).catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  if (new URL(request.url).origin === self.location.origin && ['script', 'style', 'font'].includes(request.destination)) {
    event.respondWith(
      caches.open(APP_CACHE).then(async (cache) => {
        try {
          const response = await fetch(request);
          await cache.put(request, response.clone());
          return response;
        } catch {
          return (await cache.match(request)) || Response.error();
        }
      })
    );
    return;
  }

  if (request.destination !== 'image') return;

  event.respondWith(
    caches.open(IMAGE_CACHE).then(async (cache) => {
      try {
        const response = await fetch(request);
        if (response.ok || response.type === 'opaque') {
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        const cached = await cache.match(request);
        return cached || Response.error();
      }
    })
  );
});
