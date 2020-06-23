self.addEventListener('install', function(e) {
    e.waitUntil(
      caches.open('podcast-app').then(function(cache) {
        return cache.addAll([
          './player.htm',
          './podcasts.webmanifest',
          './apple-touch-icon.png',
          './sw.js',
          './'
        ]);
      }).catch( err => console.log(err))
    );
   });
   

   self.addEventListener('fetch', function(event) {
     if ( event.request.url.indexOf('.mp3') !== -1 ) {
        //mp3 file. Cache first, do not redownload.
        return event.respondWith(
          caches.open( 'media' ).then(function(cache) {
            return cache.match(event.request).then(function (response) {
              return response || fetch(event.request).then(function(response) {
                cache.put(event.request, response.clone());
                return response;
              });
            });
          })
        );      
     }
      event.respondWith(
        caches.open('podcast-app').then(function(cache) {
          return fetch(event.request).then(function(response) {
            cache.put(event.request, response.clone());
            return response;
          }).catch(function() {
            return caches.match(event.request);
          });
        })
      );
  });
  

  
   