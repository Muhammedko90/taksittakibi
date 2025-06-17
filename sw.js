// GÜNCELLEME: Önbellek sürümü artırıldı ve cache'lenecek URL'ler güncellendi.
const CACHE_NAME = 'mak-taksit-cache-v17'; 
const urlsToCache = [
  '/',
  '/index.html',
  // Yerel ikonlar eklendi
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable.png',
  // CDN'ler
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  // Day.js ve tüm eklentileri eklendi
  'https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js',
  'https://cdn.jsdelivr.net/npm/dayjs@1/plugin/customParseFormat.js',
  'https://cdn.jsdelivr.net/npm/dayjs@1/plugin/isSameOrBefore.js',
  'https://cdn.jsdelivr.net/npm/dayjs@1/plugin/isSameOrAfter.js',
  'https://cdn.jsdelivr.net/npm/dayjs@1/plugin/localizedFormat.js',
  'https://cdn.jsdelivr.net/npm/dayjs@1/locale/tr.js',
  // Diğer kütüphaneler
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Önbellek açıldı ve dosyalar ekleniyor.');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
