var CACHE_NAME="mapalaraiz-colectivos-pwa-v5";
var CACHE_ASSETS=[
  "./",
  "./index.html",
  "./style.css",
  "./leaflet.css",
  "./leaflet.js",
  "./app.js",
  "./pizarron.png",
  "./logo.jfif",
  "./camposfiltrados.geojson",
  "./localidades_la_plata.geojson",
  "./localidades_limites_lineas.geojson",
  "./municipios_boundaries.geojson",
  "./recorridos_lp.geojson",
  "./CalibriCustom.TTF",
  "./CooperBlackCustom.otf"
];

self.addEventListener("install",function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(CACHE_ASSETS);
    })
  );
  try{ self.skipWaiting(); }catch(e){}
});

self.addEventListener("activate",function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.map(function(key){
          if(key!==CACHE_NAME){
            return caches.delete(key);
          }
        })
      );
    })
  );
  try{ self.clients.claim(); }catch(e){}
});

self.addEventListener("fetch",function(event){
  event.respondWith(
    caches.match(event.request).then(function(response){
      if(response){
        return response;
      }
      return fetch(event.request);
    })
  );
});
