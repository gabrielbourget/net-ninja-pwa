// -> Sometimes the browser complains if you don't do this.
const self = this;

// -> Fired upon service worker installation
self.addEventListener("install", (e) => {
  console.log("[sw.js]: Service worker succeessfuly installed.");
});

// -> Fired upon service worker activation
self.addEventListener("activate", (e) => {
  console.log("[sw.js]: Service worker successfully activated.");
});
