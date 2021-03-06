// -> Sometimes the browser complains if you don't do this.
const self = this;
// - DEV NOTE -> A crude way to get a cache to reinstall new content is to change the name.
//              -> This triggers a reinstallation of all content (including the new stuff)
const STATIC_CACHE_NAME = "static-assets-cache";
const DYNAMIC_CACHE_NAME = "dynamic-assets-cache";
const MAX_DYNAMIC_CACHE_ITEMS = 20;

const staticCacheAssets = [
  "/", "/index.html",  "/js/app.js", "/js/ui.js", "/js/materialize.min.js",
  "/css/styles.css", "/css/materialize.min.css", "/img/dish.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v82/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "/pages/fallback.html",
];

// -> Cache size limiter
const limitCacheSize = (cacheName, maxSize) => {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > maxSize) {
        // -> Delete first resource, recursively call the function until the size is at
        //    it's maximum limit.
        cache.delete(keys[0]).then(limitCacheSize(cacheName, maxSize));
      }
    });
  });
}

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
    // - DEV NOTE -> This block of code cycles through all currently stored caches and deletes
    //               any of them who's names don't match up to a specific one (in this case the
    //               network value of the STATIC_CACHE_NAME or DYNAMIC_CACHE_NAME variable).
    //            -> This only works since the value of those variables are currently being
    //               manually changed every time I want to trigger this (maybe there's a
    //               dynamic way to do this).
    //              -> The reasons for placing this logic here have to do with the larger
    //                 nuances of the service worker lifecycle. The activation event is
    //                 the moment where a newly updated service worker takes over for a 
    //                 previous one. Clearing out previous caches helps to ensure that
    //                 appropriate network calls will be made to get any new content/functionality,
    //                 rather than drawing from a potentially stale cache.
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => (key !== STATIC_CACHE_NAME) && (key !== DYNAMIC_CACHE_NAME))
          .map((key) => caches.delete(key))
      );
    })
  );
});

// -> Intercepts any outbound network request
self.addEventListener("fetch", (e) => {
  // console.log("[sw.js]: Service worker successfully intercepting HTTP traffic");
  // - DEV NOTE -> This is to avoid caching resouorces drawn from the database.
  //              -> The underlying Google Firebase tools being employed are managing that
  //                 process in an automated fashion, using IndexedDB.
  if (e.request.url.indexOf("firestore.googleapis.com") === -1) {
    e.respondWith(
    //   // - DEV NOTE -> Check to see if the resource requested is already in the cache.
    //   //   -> If it is, return it from there, if not, carry on with the original outbound request.
      caches.match(e.request).then((cacheResponse) => {
        return cacheResponse || fetch(e.request).then(async (fetchResponse) => {
          const cache = await caches.open(DYNAMIC_CACHE_NAME);
          // - DEV NOTE -> Need to clone the response since you can only manipulated it once.
          //              -> Without doing this, we would not be able to pass this along, and the
          //                 network flow would be interrupted.
          cache.put(e.request.url, fetchResponse.clone());
          limitCacheSize(DYNAMIC_CACHE_NAME, MAX_DYNAMIC_CACHE_ITEMS);
          return fetchResponse;
        });
      // - DEV NOTE -> If there is a no match in the cache and there's an error retrieving the resource
      //               from the network, reach into the cache for a fallback page.
      //              -> Only return the fallback page if the request was made for a page (e.g. not an image)
      //              -> This conditional approach can be applied to other types of files (e.g. images)
      }).catch(() => {
        if (e.request.url.indexOf(".html") > -1) {
          caches.match("/pages/fallback.html")
        }
      })
    );
  }
});
