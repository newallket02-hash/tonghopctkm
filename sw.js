/* Service worker — network-first cho nội dung, cache chỉ dùng khi offline.
   Nhờ vậy mỗi lần deploy bản mới là nhân viên thấy ngay, không cần xoá cache. */
const CACHE = 'glh-ontap-v4';
const SHELL = ['./', './index.html', './data.js', './offers.js', './manifest.webmanifest',
               './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(()=>{})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  const isContent = req.mode === 'navigate' || /\.(html|js|css|csv|webmanifest)$/i.test(url.pathname) || url.pathname === '/';

  if (isContent) {
    // NETWORK-FIRST: luôn lấy bản mới nhất; hết mạng mới dùng cache
    e.respondWith(
      fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(req, {ignoreSearch:true}).then(c => c || caches.match('./index.html')))
    );
  } else {
    // Ảnh, icon: cache-first cho nhanh
    e.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }))
    );
  }
});
