importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) console.log(`Workbox berhasil dimuat`);
else console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute(
	[
    { url: '/index.html', revision: '1' },
    { url: '/detail-team.html', revision: '1' },
    { url: '/nav.html', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/service-worker.js', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/css/style.css', revision: '1' },
    { url: '/js/api.js', revision: '1' },
    { url: '/js/db.js', revision: '1' },
    { url: '/js/idb.js', revision: '1' },
    { url: '/js/materialize.min.js', revision: '1' },
    { url: '/js/nav.js', revision: '1' },
    { url: '/js/pushApi.js', revision: '1' },
    { url: '/js/swRegister.js', revision: '1' },
    { url: '/pages/saved.html', revision: '1' },
    { url: '/pages/standing.html', revision: '1' },
    { url: '/pages/teams.html', revision: '1' },
    { url: '/icon/icon.png', revision: '1' },
    { url: '/icon/icon-192.png', revision: '1' },
    { url: 'https://fonts.googleapis.com/icon?family=Material+Icons', revision: '1' },
    { url: 'https://fonts.gstatic.com/s/materialicons/v67/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2', revision: '1' },
	],
	{
		ignoreUrlParametersMatching: [/.*/],
	}
);

// Team-Icona Cache
workbox.routing.registerRoute(
    new RegExp("https://crests\\.football-data\\.org.*\\.svg"),
    workbox.strategies.cacheFirst({
      cacheName: "team-icon",
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30,
        }),
      ],
    })
);
  
// API Cache
workbox.routing.registerRoute(
    new RegExp("https://api.football-data.org/v2/"),
    workbox.strategies.staleWhileRevalidate({
        cacheName: "cache-api",
})
);
  
// Images Cache
workbox.routing.registerRoute(
/.*.(?:png|jpg|jpeg|svg|gif|crests.football-data.org)/,
workbox.strategies.cacheFirst({
    cacheName: "cache-image",
    plugins: [
    new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 7,
        maxEntries: 50,
        purgeOnQuotaError: true,
    }),
    ],
})
);

self.addEventListener('push', function(event) {
    var body;
    if (event.data) {
      body = event.data.text();
    } else {
      body = 'Push message no payload';
    }
    var options = {
      body: body,
      icon: 'icon/icon.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    event.waitUntil(
      self.registration.showNotification('Push Notification', options)
    );
});

