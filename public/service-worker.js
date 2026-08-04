self.addEventListener('push', (event) => {
  let payload = {};
  try { payload = event.data?.json() || {}; } catch { payload = {}; }
  const title = typeof payload.title === 'string' ? payload.title : 'Arshida';
  const options = {
    body: typeof payload.body === 'string' ? payload.body : 'There is an update in your workspace.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: typeof payload.tag === 'string' ? payload.tag : 'arshida-update',
    data: { path: typeof payload.path === 'string' && payload.path.startsWith('/') && !payload.path.startsWith('//') ? payload.path : '/account' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.path || '/account', self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
    const existing = windows.find((client) => client.url.startsWith(self.location.origin));
    return existing ? existing.navigate(target).then(() => existing.focus()) : clients.openWindow(target);
  }));
});
