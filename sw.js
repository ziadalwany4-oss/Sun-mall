// نسخة الكاش: غيّر الرقم لو غيّرت ملفات كتير
const CACHE = "sunmall-v1";
const FILES = ["./", "index.html", "logo.png", "manifest.json", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
    self.skipWaiting();
});

self.addEventListener("activate", e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// الشبكة الأول (عشان أي تعديل يظهر على طول)، ولو مفيش نت نعرض النسخة المحفوظة
self.addEventListener("fetch", e => {
    if (e.request.method !== "GET") return;
    if (new URL(e.request.url).origin !== location.origin) return;
    e.respondWith(
        fetch(e.request)
            .then(res => {
                const copy = res.clone();
                caches.open(CACHE).then(c => c.put(e.request, copy));
                return res;
            })
            .catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
    );
});
