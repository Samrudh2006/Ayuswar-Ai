// AyuSwar AI Progressive Web App Service Worker (v2)
// High-resilience offline clinical cache & mobile runtime acceleration
const CACHE_NAME = 'ayuswar-ai-v2-cache';

const STATIC_SHELL = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/favicon.svg',
  '/assets/ayuswar_master_emblem.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_SHELL).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip caching third-party telemetry or streaming audio sockets
  if (url.origin !== self.origin && !url.hostname.includes('fonts.gstatic.com')) {
    return;
  }

  // HTML Navigation: Network first, fall back to cached shell
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((res) => res || caches.match('/index.html') || caches.match('/')))
    );
    return;
  }

  // Static Assets (JS, CSS, PNG, SVG, WOFF2): Stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (event.request.url.includes('/assets/') ||
             event.request.url.endsWith('.js') ||
             event.request.url.endsWith('.css') ||
             event.request.url.endsWith('.woff2') ||
             event.request.url.endsWith('.png') ||
             event.request.url.endsWith('.svg'))
          ) {
            const cloned = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          }
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
