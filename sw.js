/*
 * Small, versioned offline shell for guests on intermittent mobile data.
 * The wedding audio is intentionally excluded because it is several megabytes
 * and should only be downloaded after the guest chooses to play it.
 */
const CACHE_NAME = "ta-wedding-shell-v3";
const CORE_ASSETS = [
  "/",
  "/qr.html",
  "/vendor/qrcode.min.js",
  "/vendor/jszip.min.js",
];
const NAVIGATION_TIMEOUT_MS = 4500;

function fetchNavigation(request) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) => setTimeout(() => reject(new Error("network timeout")), NAVIGATION_TIMEOUT_MS)),
  ]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key.startsWith("ta-wedding-shell-"))
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/audio/") || url.pathname.startsWith("/api/")) return;

  event.respondWith(
    (request.mode === "navigate" || request.destination === "document")
      ? fetchNavigation(request).catch(() => caches.match(url.pathname === "/qr.html" ? "/qr.html" : "/"))
      : caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok && (request.destination === "image" || request.destination === "script")) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return response;
        });
      }).catch(() => Response.error())
  );
});