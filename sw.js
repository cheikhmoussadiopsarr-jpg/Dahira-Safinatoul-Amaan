const CACHE = 'dahira-v1';
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(['./','index.html'])}).catch(function(){}));
  self.skipWaiting();
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(k){
    return Promise.all(k.filter(function(x){return x!==CACHE}).map(function(x){return caches.delete(x)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch', function(e){
  var r = e.request;
  if (r.method !== 'GET' || r.headers.has('range') || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(r).then(function(res){
      if (res && res.status === 200) { var copie = res.clone(); caches.open(CACHE).then(function(c){c.put(r, copie)}); }
      return res;
    }).catch(function(){
      return caches.match(r).then(function(m){return m || caches.match('./')});
    })
  );
});
