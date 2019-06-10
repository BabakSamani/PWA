// importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");
importScripts("./src/js/workbox-sw.js");

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

const { strategies } = workbox;

//Cache all the assets that we have for this app
const staticAssets = [
  "./",
  "./src/css/styling.css",
  "./src/js/scripts.js",
  "./src/images/fetch-failed.png",
  "./src/json/fallback.json"
];


self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  const cacheFirst = new workbox.strategies.CacheFirst();
  const networkFirst = new workbox.strategies.NetworkFirst();

  if( url.origin === location.origin ){
    event.respondWith(cacheFirst.makeRequest({request: event.request}));
  } else {
    event.respondWith(networkFirst.makeRequest({request: event.request}));
  }

});

// workbox.routing.registerRoute(
//     // Cache CSS files.
//     /\.css$/,
//     // Use cache but update in the background.
//     new workbox.strategies.StaleWhileRevalidate({
//       // Use a custom cache name.
//       cacheName: 'css-cache',
//     })
// );



workbox.routing.registerRoute(
    // Cache image files.
    /\.(?:png|jpg|jpeg|svg|gif)$/,
    // Use the cache if it's available.
    new workbox.strategies.CacheFirst({
      // Use a custom cache name.
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.Plugin({
          // Cache only 20 images.
          maxEntries: 20,
          // Cache for a maximum of a week.
          maxAgeSeconds: 7 * 24 * 60 * 60,
        })
      ],
    })
);

