
//Cache all the assets that we have for this app 
const staticAssets = [
    './', 
    './src/css/styling.css', 
    './src/js/scripts.js',
    './src/images/fetch-failed.png',
    './src/json/fallback.json'
];

self.addEventListener('install', async event => {
    // create a static cache to store all assets
    const cache = await caches.open('static-cache');
    cache.addAll(staticAssets);

});

// Add an event listener to fetch the news data from requested source
self.addEventListener('fetch', event => {
   const req = event.request;
   const url = new URL(req.url);

   if( url.origin === location.origin ){
       event.respondWith(cachFirstApproch(req));
   } else {
       event.respondWith(networkFirstApproch(req));
   }
});

/**
 * An async function to handle the cache first strategy
 */
async function cachFirstApproch(req) {
    const cacheResponse = await caches.match(req);
    return cacheResponse || fetch(req);
}

/**
 * An async function to handle the network first strategy
 */
async function networkFirstApproch(req) {
    // Create a dynamic cache to store the news contents
    const thisCache = await caches.open('dynamic-cache');

    try{
        //eraseCache();
        const res = await fetch(req);
        thisCache.put(req, res.clone());
        return res;
    } catch (error) {
        return await thisCache.match(req) || await caches.match('./src/json/fallback.json');
    } 
}


function eraseCache(){
    window.location = window.location.href+'?eraseCache=true';
}