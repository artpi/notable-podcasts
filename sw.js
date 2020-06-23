const currentVersion = 'app-v21';

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(currentVersion).then(function (cache) {
      return cache.addAll([
        './player.htm',
        './podcasts.webmanifest',
        './assets/localforage.nopromises.min.js',
        './apple-touch-icon.png',
        './favicon.ico',
      ]);
    }).catch(err => console.log(err))
  );
});


self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  // delete any caches that aren't in expectedCaches
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== currentVersion) {
          return caches.delete(key);
        }
      })
    )).then(() => {
      console.log(currentVersion + ' now ready to handle fetches!');
    })
  );
});
