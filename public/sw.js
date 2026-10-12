// Service worker mínimo.
//
// Navegação (HTML): sempre rede primeiro — nunca mostrar uma página
// desatualizada depois de uma publicação nova. Só usa a cache se a
// rede falhar (offline).
//
// Resto (imagens, CSS, JS): stale-while-revalidate — mostra o que
// estiver em cache instantaneamente, atualiza por trás.

const CACHE_NAME = "radial-v3";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(
          chaves.filter((c) => c !== CACHE_NAME).map((c) => caches.delete(c)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      // no-store: nunca deixar a cache HTTP normal do browser devolver um
      // HTML antigo mesmo dizendo "vai à rede" — foi isto que causou uma
      // correção publicada a não aparecer para quem já tinha visitado o
      // site antes da publicação.
      fetch(event.request, { cache: "no-store" }).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(event.request)) ?? Response.error();
      }),
    );
    return;
  }

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
