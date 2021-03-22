if (navigator.serviceWorker) {
  navigator.serviceWorker.register("/sw.js")
    .then((reg) => console.log("[app.js]: Service worker registered -> ", reg))
    .catch((err) => console.error("[app.js]: Problem registering service worker -> ", err));
}
