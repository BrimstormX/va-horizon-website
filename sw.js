importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

workbox.core.skipWaiting();
workbox.core.clientsClaim();

const CACHE_VERSION = 'v3';

workbox.precaching.precacheAndRoute([
  { url: '/', revision: CACHE_VERSION },
  { url: '/index.html', revision: CACHE_VERSION },
  { url: '/cards.css', revision: CACHE_VERSION },
  { url: '/fonts.css', revision: CACHE_VERSION },
  { url: '/offline.html', revision: CACHE_VERSION }
]);

workbox.precaching.cleanupOutdatedCaches();

workbox.routing.registerRoute(
  ({request, url}) =>
    (request.destination === 'style' || request.destination === 'script') &&
    url.origin !== self.location.origin,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'cdn-assets'
  })
);

workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  ({request}) => request.mode === 'navigate',
  async ({event}) => {
    try {
      return await fetch(event.request);
    } catch (err) {
      return await caches.match('/offline.html');
    }
  }
);
