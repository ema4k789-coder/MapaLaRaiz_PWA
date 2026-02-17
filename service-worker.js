const CACHE_NAME = 'mapalaraiz-cache-v1';

const URLS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './leaflet.css',
  './leaflet.js',
  './pizarron.png',
  './CooperBlackCustom.otf',
  './CalibriCustom.TTF',
  './camposfiltrados.geojson',
  './camposfiltrados1.geojson',
  './municipios_boundaries.geojson',
  './localidades_la_plata.geojson',
  './localidades_limites_lineas.geojson'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key !== CACHE_NAME;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then(function (resp) {
      if (resp) return resp;
      return fetch(req).catch(function () {
        return caches.match('./index.html');
      });
    })
  );
});

