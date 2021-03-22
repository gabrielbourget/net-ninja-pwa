// -> Sometimes the browser complains if you don't do this.
const self = this;

self.addEventListener("install", (e) => {
  console.log("[sw.js]: Service worker succeessfuly installed.");
});