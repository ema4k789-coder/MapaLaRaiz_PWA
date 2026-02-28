var CACHE_NAME="mapalaraiz-colectivos-pwa-v6";
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
  "./CooperBlackCustom.otf",
  "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/lib/browser.min.js"
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

self.addEventListener("message",function(event){
  try{
    if(event && event.data && event.data.type==="SKIP_WAITING"){
      self.skipWaiting();
    }
  }catch(e){}
});

self.addEventListener("fetch",function(event){
  var req=event.request;
  if(req && req.mode==="navigate"){
    event.respondWith(
      fetch(req).then(function(res){
        try{
          var copy=res.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(req, copy); });
        }catch(e){}
        return res;
      }).catch(function(){
        return caches.match(req).then(function(r){
          return r || caches.match("./index.html");
        });
      })
    );
    return;
  }
  event.respondWith(
    caches.match(req).then(function(response){
      if(response){
        try{
          fetch(req).then(function(res){
            if(!res || !res.ok) return;
            try{
              var copy=res.clone();
              caches.open(CACHE_NAME).then(function(cache){ cache.put(req, copy); });
            }catch(e){}
          });
        }catch(e){}
        return response;
      }
      return fetch(req).then(function(res){
        if(!res || !res.ok) return res;
        try{
          var copy=res.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(req, copy); });
        }catch(e){}
        return res;
      });
    })
  );
});
