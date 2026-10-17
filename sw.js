// Service worker sederhana: hanya menyimpan "cangkang" halaman ini (bukan data aplikasi).
// Permintaan ke Google Apps Script (lain origin) tidak pernah disimpan, jadi data penilaian tidak tersimpan di perangkat.
const V = 'pkg-v1', SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x != V).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method != 'GET' || new URL(r.url).origin != location.origin) return;
  e.respondWith(fetch(r).then(x => { const c = x.clone(); caches.open(V).then(h => h.put(r, c)); return x; })
    .catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
});
