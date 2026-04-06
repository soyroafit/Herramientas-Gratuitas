const CACHE = "roafit-v3";

// Solo cachear assets estáticos que no cambian
const STATIC_ASSETS = [
  "/logo-roafit.png",
  "/manifest.json"
];

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  if (e.request.method !== "GET") return;

  var url = e.request.url;

  // Para los trackers y páginas HTML: SIEMPRE red primero, sin caché
  // Esto garantiza que los datos del localStorage se lean correctamente
  if (url.includes('.html') || url.endsWith('/') || url.includes('tracker') || url.includes('index')) {
    e.respondWith(
      fetch(e.request).catch(function() {
        return caches.match(e.request);
      })
    );
    return;
  }

  // Para imágenes y assets estáticos: caché primero
  if (url.includes('.png') || url.includes('.jpg') || url.includes('.json') || url.includes('.css')) {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        return cached || fetch(e.request).then(function(response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
          }
          return response;
        });
      })
    );
    return;
  }

  // Todo lo demás: red directa
  e.respondWith(fetch(e.request).catch(function() {
    return caches.match(e.request);
  }));
});
