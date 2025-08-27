importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

workbox.precaching.precacheAndRoute([
  { url: '/', revision: null },
  { url: '/index.html', revision: null },
  { url: '/offline.html', revision: null },
  { url: '/manifest.webmanifest', revision: null },
  { url: '/buttons.js', revision: null },
  { url: '/VAHorizonWebsiteStyle/_json/b8cc1495-97aa-442e-8ac3-d88e0d67917f/_index.json', revision: null },
  { url: '/VAHorizonWebsiteStyle/_runtimes/sites-runtime.d235144d4b17f87c86424e10da637effad05fcb155512de2291561ba2e544140.js', revision: null },
  { url: '/VAHorizonWebsiteStyle/_components/v1/93bdfffda6e0bf9a7fd91429ea912af65458e738.css', revision: null },
  { url: '/VAHorizonWebsiteStyle/_components/v1/93bdfffda6e0bf9a7fd91429ea912af65458e738.js', revision: null },
  { url: '/icons/icon.svg', revision: null }
]);
workbox.precaching.cleanupOutdatedCaches();

workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'images',
  })
);

workbox.routing.registerRoute(
  ({request}) => request.mode === 'navigate',
  async ({event}) => {
    try {
      return await workbox.precaching.matchPrecache(event.request) || await fetch(event.request);
    } catch (err) {
      return caches.match('/offline.html');
    }
  }
);

const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('contactFormQueue', {
  maxRetentionTime: 24 * 60
});

workbox.routing.registerRoute(
  /https:\/\/formspree\.io\/f\/mjkgwvno/,
  new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);
