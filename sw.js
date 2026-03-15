/* SW.JS - EWINTH REVENGE PWA 
   Service Worker ini menangani instalasi dan caching offline.
*/

const CACHE_NAME = 'ewinth-revenge-v1';

// Daftar file yang wajib di-cache agar tombol "Install" muncul di Chrome
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://unpkg.com/lucide@latest'
];

// Tahap Install: Menyimpan file ke dalam memori HP/Browser
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets...');
      return cache.addAll(assetsToCache);
    })
  );
});

// Tahap Aktifasi: Menghapus cache lama jika ada update
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Tahap Fetch: Mengambil data dari cache jika offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Kembalikan dari cache jika ada, jika tidak ambil dari jaringan (internet)
      return response || fetch(event.request);
    })
  );
});
