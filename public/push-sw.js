self.addEventListener('push', function (event) {
  if (!event.data) return;

  const payload = event.data.json();

  const options = {
    body: payload.body,
    icon: payload.icon || '/icon-192x192.png',
    badge: '/badge.png',
    data: {
      url: payload.data?.url || '/siswa' // 🔥 FIX DI SINI
    }
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
