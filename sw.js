const CACHE = "isbn-sbs-v4";
const APP_SHELL = ["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png","./favicon.png","https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"];
self.addEventListener("install", event => { event.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch", event => {
  const req=event.request;
  if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(url.origin===location.origin && req.mode==="navigate"){
    event.respondWith(fetch(req).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy));return r}).catch(()=>caches.match("./index.html")));
    return;
  }
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(r=>{if(r.ok&&url.origin===location.origin){const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy))}return r})));
});
