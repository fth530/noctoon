
const CACHE_NAME = "noctoon-v1";
const URLS_TO_CACHE = [
    "/",
    "/index.html",
    "/manifest.json",
    "/pwa-192x192.png",
    "/pwa-512x512.png",
    "/favicon.svg"
];

// Install Service Worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(URLS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate & Cleanup Old Caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Strategy: Network First, fallback to Cache
self.addEventListener("fetch", (event) => {
    // Skip API requests and cross-origin requests
    if (!event.request.url.startsWith(self.location.origin) || event.request.url.includes("/api/")) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
