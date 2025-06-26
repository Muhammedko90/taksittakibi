// GÜNCELLEME: Önbellek sürümü artırıldı ve kısayol ikonu eklendi.
const CACHE_NAME = 'mak-taksit-cache-v18'; 
const urlsToCache = [
  '/',
  '/index.html',
  // Yerel ikonlar
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable.png',
  '/icons/add-shortcut.png', // Kısayol için yeni ikon
  // CDN'ler
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  // Day.js ve tüm eklentileri
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
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Önbellek açıldı ve dosyalar ekleniyor.');
        // Hataları görmezden gel, özellikle çapraz kaynaklı CDN'ler için
        return cache.addAll(urlsToCache).catch(err => console.warn('Tüm kaynaklar önbelleğe alınamadı:', err));
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
  const url = new URL(event.request.url);

  // Eğer istek bir kısayol linki ise (action parametresi içeriyorsa),
  // her zaman önbellekteki ana index.html sayfasını döndür.
  if (url.pathname === '/index.html' || url.pathname === '/') {
    event.respondWith(caches.match('/index.html'));
    return;
  }

  // Diğer tüm istekler için standart "önce önbellek" stratejisini kullan.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
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
