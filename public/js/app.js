if (navigator.serviceWorker) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then((reg) => console.log("[app.js]: Service worker registered"))
      .catch((err) => console.error("[app.js]: Problem registering service worker"));
  });
}
