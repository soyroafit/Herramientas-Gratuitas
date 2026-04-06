const CACHE = "roafit-v2";
const ASSETS = [
  "/",
  "/index.html",
  "/valoracion-inicial.html",
  "/seguimiento-semanal.html",
  "/tracker-plan.html",
  "/tracker-alimentacion.html",
  "/entrenamiento.html",
  "/calculadora-calorias.html",
  "/objetivos-nutricionales.html",
  "/Tracker-Nuevos-Habitos.html",
  "/logo-roafit.png",
  "/manifest.json"
];

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
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
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return fetch(e.request).then(function(response) {
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
        }
        return response;
      }).catch(function() {
        return cached;
      });
    })
  );
});
