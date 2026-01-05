// sw.js - Service Worker für Offline-Funktionalität
const CACHE_NAME = 'wb-mental-coach-v2.0.0';
const STATIC_CACHE = 'wb-static-v2.0.0';
const DYNAMIC_CACHE = 'wb-dynamic-v2.0.0';

// Assets die gecacht werden sollen (relative Pfade für GitHub Pages)
const STATIC_ASSETS = [
  'index.html',
  'css/styles.css',
  'js/nav.js',
  'js/supa.js',
  'js/config.js',
  'js/utils.js',
  'js/check-auth.js',
  'js/dark-mode.js',
  'js/error-handler.js',
  'js/app.js',
  'js/router.js',
  'assets/logo/logo.png'
];

// Install Event - Cache statische Assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((err) => {
        console.error('[SW] Cache failed:', err);
      })
  );
  self.skipWaiting(); // Aktiviert den neuen SW sofort
});

// Activate Event - Alte Caches löschen
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  return self.clients.claim(); // Übernimmt sofort die Kontrolle
});

// Fetch Event - Network First Strategy für dynamische Inhalte
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Supabase API calls (immer online)
  if (url.hostname.includes('supabase.co')) {
    return;
  }

  // Skip externe Ressourcen
  if (url.origin !== location.origin && !url.hostname.includes('cdn.jsdelivr.net')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone response für Cache
        const responseToCache = response.clone();

        // Cache dynamische Inhalte
        if (response.status === 200) {
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }

        return response;
      })
      .catch(() => {
        // Fallback: Versuche aus Cache zu laden
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // Fallback für Navigation requests (SPA)
          if (request.mode === 'navigate') {
            return caches.match('index.html');
            return caches.match('/index.html');
          }

          // Fallback für andere Requests
          return new Response('Offline - Keine Verbindung', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html'
            })
          });
        });
      })
  );
});

// Background Sync für Tagebuch-Einträge (optional, erweiterte Funktion)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-diary') {
    event.waitUntil(syncDiaryEntries());
  }
});

async function syncDiaryEntries() {
  // Diese Funktion würde lokale Einträge mit dem Server synchronisieren
  // Implementierung würde IndexedDB verwenden
  console.log('[SW] Syncing diary entries...');
}

