const CACHE = "roafit-v1";
const ASSETS = [
  "/Herramientas-Gratuitas/",
  "/Herramientas-Gratuitas/index.html",
  "/Herramientas-Gratuitas/valoracion-inicial.html",
  "/Herramientas-Gratuitas/seguimiento-semanal.html",
  "/Herramientas-Gratuitas/tracker-plan.html",
  "/Herramientas-Gratuitas/tracker-alimentacion.html",
  "/Herramientas-Gratuitas/entrenamiento.html",
  "/Herramientas-Gratuitas/calculadora-calorias.html",
  "/Herramientas-Gratuitas/objetivos-nutricionales.html",
  "/Herramientas-Gratuitas/Tracker-Nuevos-Habitos.html",
  "/Herramientas-Gratuitas/logo-roafit.png"
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
  // Only handle GET requests
  if (e.request.method !== "GET") return;
  // Don't cache external requests (EmailJS, Make, Google)
  if (!e.request.url.includes("soyroafit.github.io") && !e.request.url.includes("roafit.com")) return;

  e.respondWith(
    caches.match(e.request).then(function(cached) {
      // Network first, fall back to cache
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
