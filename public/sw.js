// Service worker mínimo — "stale-while-revalidate" para pedidos GET.
// Mostra o que estiver em cache instantaneamente e atualiza por trás.
// Sem precache de rotas específicas: cresce à medida que se navega.

const CACHE_NAME = "radial-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      const rede = fetch(event.request)
        .then((resposta) => {
          if (resposta.ok) cache.put(event.request, resposta.clone());
          return resposta;
        })
        .catch(() => cached);

      return cached ?? rede;
    }),
  );
});
