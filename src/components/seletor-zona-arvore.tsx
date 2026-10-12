"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { agruparPorDistrito, distritoDoConcelho } from "@/lib/distritos-concelhos";

// Menu em árvore Distrito → Concelho, inspirado em
// ui.watermelon.sh/animated-components/tree-menu — transições em CSS puro
// (transform/opacity), sem dependências extra. Só distritos/concelhos com
// imóveis reais aparecem (a lista vem já filtrada de fora).
export function SeletorZonaArvore({
  concelhos,
  valorInicial,
}: {
  concelhos: string[];
  valorInicial?: string;
}) {
  const t = useTranslations("filters");
  const distritos = agruparPorDistrito(concelhos);
  const [aberto, setAberto] = useState(false);
  const [distritoAtivo, setDistritoAtivo] = useState<string | null>(null);
  const [valor, setValor] = useState(valorInicial ?? "");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function aoClicarFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAberto(false);
        setDistritoAtivo(null);
      }
    }
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, []);

  const rotulo = valor ? `${distritoDoConcelho(valor)} · ${valor}` : t("all");

  function escolherConcelho(concelho: string) {
    setValor(concelho);
    setAberto(false);
    setDistritoAtivo(null);
  }

  function limpar(e: React.MouseEvent) {
    e.stopPropagation();
    setValor("");
    setAberto(false);
    setDistritoAtivo(null);
  }

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name="zona" value={valor} />
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="flex w-full items-center justify-between rounded-md border border-grid bg-background px-3 py-2 text-sm outline-none focus:border-brand-blue"
      >
        <span className="truncate">{rotulo}</span>
        <span className="flex shrink-0 items-center gap-2">
          {valor && (
            <span
              onClick={limpar}
              className="text-xs text-foreground-secondary hover:text-brand-red"
            >
              limpar
            </span>
          )}
          <ChevronRight
            size={14}
            className={`transition-transform duration-150 ${aberto ? "rotate-90" : ""}`}
          />
        </span>
      </button>

      {aberto && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-grid bg-background shadow-lg">
          {/* Duas colunas empilhadas horizontalmente, deslizam com transform —
              nunca escondidas via display:none, para a transição correr sempre. */}
          <div
            className="flex w-[200%] transition-transform duration-200 ease-out"
            style={{ transform: distritoAtivo ? "translateX(-50%)" : "translateX(0%)" }}
          >
            <ul className="max-h-64 w-1/2 overflow-y-auto py-1">
              {distritos.map((d) => (
                <li key={d.distrito}>
                  <button
                    type="button"
                    onClick={() => setDistritoAtivo(d.distrito)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-brand-blue/5"
                  >
                    {d.distrito}
                    <ChevronRight size={14} className="text-foreground-secondary" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="w-1/2">
              <button
                type="button"
                onClick={() => setDistritoAtivo(null)}
                className="flex w-full items-center gap-1 border-b border-grid px-3 py-2 text-left text-xs font-semibold text-brand-blue hover:bg-brand-blue/5"
              >
                ← {distritoAtivo}
              </button>
              <ul className="max-h-56 overflow-y-auto py-1">
                {distritoAtivo &&
                  distritos
                    .find((d) => d.distrito === distritoAtivo)
                    ?.concelhos.map((c) => (
                      <li key={c}>
                        <button
                          type="button"
                          onClick={() => escolherConcelho(c)}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-brand-blue/5 ${
                            valor === c ? "font-semibold text-brand-blue" : ""
                          }`}
                        >
                          {c}
                        </button>
                      </li>
                    ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
