// -> Sometimes the browser complains if you don't do this.
const self = this;
const STATIC_CACHE_NAME = "static-assets-cache";

const staticCacheAssets = [
  "/", "/index.html",  "/js/app.js", "/js/ui.js", "/js/materialize.min.js",
  "/css/styles.css", "/css/materialize.min.css", "/img/dish.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v82/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
];

// -> Fired upon service worker installation
self.addEventListener("install", (e) => {
  // console.log("[sw.js]: Service worker succeessfuly installed.");
  e.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      // cache.add(); // -> Add a specific resource
      // cache.addAll(); // -> Pass in an array of resources 
      console.log("[sw.js]: Caching application shell assets");
      cache.addAll(staticCacheAssets);
    })
  );
});

// -> Fired upon service worker activation
self.addEventListener("activate", (e) => {
  // console.log("[sw.js]: Service worker successfully activated.");
});

// -> Intercepts any outbound network request
self.addEventListener("fetch", (e) => {
  // console.log("[sw.js]: Service worker successfully intercepting HTTP traffic");
  e.respondWith(
    caches.match(e.request).then((cacheResponse) => {
      return cacheResponse || fetch(e.request);
    })
  );
});
