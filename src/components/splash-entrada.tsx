"use client";

import { useEffect, useState } from "react";

const CHAVE_SESSAO = "radial-entrou";

export function SplashEntrada() {
  const [pronto, setPronto] = useState(false);
  const [mostrar, setMostrar] = useState(true);
  const [logoVisivel, setLogoVisivel] = useState(false);
  const [aDesvanecer, setADesvanecer] = useState(false);

  useEffect(() => {
    const jaEntrou = sessionStorage.getItem(CHAVE_SESSAO);

    if (jaEntrou) {
      setMostrar(false);
      setPronto(true);
      return;
    }

    sessionStorage.setItem(CHAVE_SESSAO, "1");
    setPronto(true);

    const mostrarLogo = requestAnimationFrame(() => setLogoVisivel(true));
    const iniciarFade = setTimeout(() => setADesvanecer(true), 1000);
    const remover = setTimeout(() => setMostrar(false), 1700);
    return () => {
      cancelAnimationFrame(mostrarLogo);
      clearTimeout(iniciarFade);
      clearTimeout(remover);
    };
  }, []);

  // Antes do JS decidir, cobre tudo para não haver um flash da página por
  // baixo — o mesmo em servidor e cliente, por isso não há erro de hidratação.
  if (!pronto) {
    return <div className="fixed inset-0 z-50 bg-background" aria-hidden />;
  }

  if (!mostrar) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-700 ease-out ${
        aDesvanecer ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-radial.png"
        alt=""
        className={`w-56 transition-all duration-700 ease-out ${
          logoVisivel ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      />
    </div>
  );
}
