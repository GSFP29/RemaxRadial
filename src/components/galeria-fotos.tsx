"use client";

import { useRef, useState } from "react";
import { imagemUrl } from "@/lib/imoveis-formato";

export function GaleriaFotos({ fotos }: { fotos: string[] }) {
  const [indice, setIndice] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (fotos.length === 0) return null;

  function abrir(i: number) {
    setIndice(i);
    dialogRef.current?.showModal();
  }

  function fechar() {
    dialogRef.current?.close();
  }

  function anterior() {
    setIndice((i) => (i - 1 + fotos.length) % fotos.length);
  }

  function seguinte() {
    setIndice((i) => (i + 1) % fotos.length);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") anterior();
    if (e.key === "ArrowRight") seguinte();
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {fotos.slice(0, 8).map((foto, i) => (
          <button
            key={foto}
            type="button"
            onClick={() => abrir(i)}
            className="aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagemUrl(foto, "ds-l")}
              alt=""
              className="h-full w-full object-cover transition hover:scale-105"
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClick={fechar}
        onKeyDown={onKeyDown}
        className="max-h-none max-w-none border-none bg-transparent p-0 backdrop:bg-black/90"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex h-screen w-screen items-center justify-center"
        >
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar"
            className="absolute right-4 top-4 text-3xl text-white/80 hover:text-white"
          >
            ✕
          </button>

          {fotos.length > 1 && (
            <button
              type="button"
              onClick={anterior}
              aria-label="Foto anterior"
              className="absolute left-2 text-4xl text-white/80 hover:text-white sm:left-6"
            >
              ‹
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagemUrl(fotos[indice], "ds-l")}
            alt=""
            className="max-h-[85vh] max-w-[85vw] object-contain"
          />

          {fotos.length > 1 && (
            <button
              type="button"
              onClick={seguinte}
              aria-label="Foto seguinte"
              className="absolute right-2 text-4xl text-white/80 hover:text-white sm:right-6"
            >
              ›
            </button>
          )}

          {fotos.length > 1 && (
            <span className="absolute bottom-4 text-sm text-white/70">
              {indice + 1} / {fotos.length}
            </span>
          )}
        </div>
      </dialog>
    </>
  );
}
