// -> Sometimes the browser complains if you don't do this.
const self = this;
// - DEV NOTE -> A crude way to get a cache to reinstall new content is to change the name.
//              -> This triggers a reinstallation of all content (including the new stuff)
const STATIC_CACHE_NAME = "static-assets-cache";
const DYNAMIC_CACHE_NAME = "dynamic-assets-cache";

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
      // console.log("[sw.js]: Caching application shell assets");
      cache.addAll(staticCacheAssets);
    })
  );
});

// -> Fired upon service worker activation
self.addEventListener("activate", (e) => {
  // console.log("[sw.js]: Service worker successfully activated.");
  e.waitUntil(
    // - DEV NOTE -> This block of code cycles through all currently stored caches
    //               and deletes any of them who's names don't match up to a specific one
    //               (in this case the value of the STATIC_CACHE_NAME variable).
    //              -> The reasons for placing this logic here have to do with the larger
    //                 nuances of the service worker lifecycle. The activation event is
    //                 the moment where a newly updated service worker takes over for a 
    //                 previous one. Clearing out previous caches helps to ensure that
    //                 appropriate network calls will be made to get any new content/functionality,
    //                 rather than drawing from a potentially stale cache.
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// -> Intercepts any outbound network request
self.addEventListener("fetch", (e) => {
  // console.log("[sw.js]: Service worker successfully intercepting HTTP traffic");
  e.respondWith(
    // - DEV NOTE -> Check to see if the resource requested is already in the cache.
    //   -> If it is, return it from there, if not, carry on with the original outbound request.
    caches.match(e.request).then((cacheResponse) => {
      return cacheResponse || fetch(e.request).then((fetchResponse) => {
        return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
          // - DEV NOTE -> Need to clone the response since you can only manipulated it once.
          //   -> Without doing this, we would not be able to pass this along, and the
          //      network flow would be interrupted.
          cache.put(e.request.url, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});
