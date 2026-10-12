"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { AvaliacaoGoogle } from "@/lib/avaliacoes";

// Carrossel de uma linha só, em scroll-snap CSS puro (sem biblioteca de
// animação) — navegação neutra, sem cor, só para não ficar em grelha.
export function CarrosselAvaliacoes({ avaliacoes }: { avaliacoes: AvaliacaoGoogle[] }) {
  const ref = useRef<HTMLDivElement>(null);

  function deslizar(direcao: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: direcao * el.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    <div className="relative mx-auto max-w-5xl">
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {avaliacoes.map((a) => (
          <div
            key={a.id}
            className="w-[85%] shrink-0 snap-start rounded-xl border border-grid bg-background p-6 sm:w-[45%] lg:w-[31%]"
          >
            <div className="mb-3 flex gap-0.5 text-brand-blue">
              {Array.from({ length: a.estrelas }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p className="text-sm text-foreground-secondary">“{a.texto}”</p>
            <p className="mt-4 text-sm font-semibold">— {a.nome_autor}</p>
          </div>
        ))}
      </div>

      {avaliacoes.length > 3 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => deslizar(-1)}
            aria-label="Anteriores"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-grid text-foreground-secondary transition hover:border-foreground/40 hover:text-foreground"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => deslizar(1)}
            aria-label="Seguintes"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-grid text-foreground-secondary transition hover:border-foreground/40 hover:text-foreground"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
