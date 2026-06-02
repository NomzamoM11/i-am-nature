// I AM NATURE — Service Worker
// Handles offline caching and loading fallback

const CACHE_NAME = "iamnature-v1";

// Pages and assets to pre-cache on install
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/about.html",
  "/alchemy.html",
  "/contact.html",
  "/journal.html",
  "/journal-entry-001.html",
  "/journal-entry-002.html",
  "/journal-entry-003.html",
  "/shop.html",
  "/policies.html",
  "/offline.html",
  "/styles.css",
  "/data.js",
  "/script.js",
];

// ── INSTALL: pre-cache all core pages ────────────────────────────────────────
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(function () {
        return self.skipWaiting();
      }),
  );
});

// ── ACTIVATE: clear old caches ────────────────────────────────────────────────
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames
            .filter(function (name) {
              return name !== CACHE_NAME;
            })
            .map(function (name) {
              return caches.delete(name);
            }),
        );
      })
      .then(function () {
        return self.clients.claim();
      }),
  );
});

// ── FETCH: serve from cache, fall back to network, fall back to offline ───────
self.addEventListener("fetch", function (event) {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  // Skip cross-origin requests (fonts, external scripts)
  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        // Serve from cache immediately, then update cache in background
        var fetchPromise = fetch(event.request)
          .then(function (networkResponse) {
            if (networkResponse && networkResponse.status === 200) {
              var responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(function (cache) {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(function () {
            // Network failed — cached version already being served, no action needed
          });
        // Return cached version without waiting for network
        return cachedResponse;
      }

      // Not in cache — try network
      return fetch(event.request)
        .then(function (networkResponse) {
          if (networkResponse && networkResponse.status === 200) {
            var responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(function () {
          // Network failed and not in cache — serve offline page
          return caches.match("/offline.html");
        });
    }),
  );
});
