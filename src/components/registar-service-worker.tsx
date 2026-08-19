"use client";

import { useEffect } from "react";

export function RegistarServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Falha em registar não deve impedir o site de funcionar normalmente.
      });
    }
  }, []);

  return null;
}
