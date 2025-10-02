// Service Worker for Portfolio Performance Optimization
const CACHE_NAME = "portfolio-v1.0.0";
const STATIC_CACHE = "portfolio-static-v1.0.0";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  // Add other static assets as needed
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== CACHE_NAME) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when possible
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response.ok) return response;

          // Cache successful responses for future use
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Only cache certain types of requests
            if (
              event.request.url.includes("/api/") ||
              event.request.destination === "document" ||
              event.request.destination === "image" ||
              event.request.destination === "font"
            ) {
              cache.put(event.request, responseClone);
            }
          });

          return response;
        })
        .catch(() => {
          // Return offline fallback if available
          return caches.match("/offline.html") || new Response("Offline");
        });
    })
  );
});
