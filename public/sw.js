const CACHE_NAME = 'agahf-survey-v3';
const urlsToCache = [
  '/',
  '/submit',
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch strategy: Network first, falling back to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // For API routes and data endpoints, always use network first with no caching
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('/reports') ||
      event.request.url.includes('/submit') || 
      event.request.url.includes('/survey')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Don't cache API responses or report pages to prevent stale data
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache as fallback
          return caches.match(event.request).then((response) => {
            if (response) {
              // Add header to indicate this is cached/stale data
              const newHeaders = new Headers(response.headers);
              newHeaders.set('X-Served-From-Cache', 'true');
              return new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: newHeaders
              });
            }
            // Return a custom offline page or message
            return new Response('Offline - Please check your connection', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain',
              }),
            });
          });
        })
    );
  } else {
    // For static assets (images, CSS, JS), use cache first strategy
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Only cache static assets (images, fonts, etc.)
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
    );
  }
});

// Handle background sync for offline submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-submissions') {
    event.waitUntil(
      // This will be triggered by the app when it wants to sync
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SYNC_REQUESTED',
          });
        });
      })
    );
  }
});
