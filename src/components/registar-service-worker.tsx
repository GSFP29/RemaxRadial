"use client";

import { useEffect } from "react";

export function RegistarServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Assim que uma versão nova do service worker assume o controlo (depois
    // de uma publicação), recarrega a página uma única vez — sem isto, uma
    // aba já aberta ficava a correr o código antigo até o utilizador fechar
    // e reabrir o site, mesmo com o service worker já atualizado. Só
    // recarrega se já havia um controlador antes (ou seja, é mesmo uma
    // atualização) — na primeira visita de sempre não há nada para atualizar.
    const jaTinhaControlador = !!navigator.serviceWorker.controller;
    let jaRecarregou = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (jaRecarregou || !jaTinhaControlador) return;
      jaRecarregou = true;
      window.location.reload();
    });

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Falha em registar não deve impedir o site de funcionar normalmente.
    });
  }, []);

  return null;
}
