
var cacheName = 'cache-v1';

var files = [
  './',
  './manifest.json',
  './index.html',
  './warehouse128.png',
  './warehouse256.png',
  './warehouse512.png',
  '../src/config/offline.js',
  '../src/config/push.js',
  '../src/config/share.js',
  '../src/config/toast.js',
  '../src/images/icons/alarm.png',
  '../src/images/icons/silence.png',
  './static/js/buldle.js',
];

self.addEventListener("install", event => {
  console.info('Event: Install');

  event.waitUntil(
    caches.open(cacheName)
    .then(function(cache) {
      return cache.addAll(files)
      .then(() => {
        console.info('All files are cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache', error)
      })
    })
  )
  });


/*
  FETCH EVENT: triggered for every request made by index page, after install.
*/

//Adding `fetch` event listener
self.addEventListener('fetch', (event) => {
  console.info('Event: Fetch');

  var request = event.request;

  //Tell the browser to wait for newtwork request and respond with below
  event.respondWith(
    //If request is already in cache, return it
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      // // Checking for navigation preload response
      // if (event.preloadResponse) {
      //   console.info('Using navigation preload');
      //   return response;
      // }

      //if request is not cached or navigation preload response, add it to cache
      var fetchRequest = event.request.clone();
  
          return fetch(fetchRequest).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

  
              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              var responseToCache = response.clone();
  
              if(event.request.method === "GET")
                caches.open(cacheName)
                  .then(function(cache) {
                    cache.put(event.request, responseToCache);
                  });
  
              return response;
            }
          ).catch(err => caches.open(cacheName).then((cache) => {
            return cache.match('./offline.html')
          }));
        })
      );
});

/*
  ACTIVATE EVENT: triggered once after registering, also used to clean up caches.
*/

self.addEventListener('activate', (event) => {
  console.info('Event: Activate');

  
  //Navigation preload is help us make parallel request while service worker is booting up.
  //Enable - chrome://flags/#enable-service-worker-navigation-preload
  //Support - Chrome 57 beta (behing the flag)
  //More info - https://developers.google.com/web/updates/2017/02/navigation-preload#the-problem

  // Check if navigationPreload is supported or not
  // if (self.registration.navigationPreload) { 
  //   self.registration.navigationPreload.enable();
  // }
  // else if (!self.registration.navigationPreload) { 
  //   console.info('Your browser does not support navigation preload.');
  // }

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if(cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      );
    })
    .then(function() {
      console.info("Old caches are cleared!");
      return self.clients.claim();
    })
  )
})

/*
  PUSH EVENT: triggered everytime, when a push notification is received.
*/
self.addEventListener("push", event => {
  console.info('Event: Push');
  
  const title = "Prototype";
  const options = {
    body: event.data.text(),
    icon: "./images/icon/warehouse256.png"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

/*
  NOTIFICATION EVENT: triggered when user click the notification.
*/

//Adding `notification` click event listener
self.addEventListener('notificationclick', (event) => {
  var url = `${process.env.PUBLIC_URL}`;

  event.notification.close(); //Close the notification

  //To open the app after clicking notification
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
    .then((clients) => {
      for (var i = 0; i < clients.length; i++) {
        var client = clients[i];
        //If site is opened, focus to the site
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }

      //If site is cannot be opened, open in new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
    .catch((error) => {
      console.error(error);
    })
  );
});
