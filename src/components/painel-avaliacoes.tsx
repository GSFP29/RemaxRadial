"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import {
  adicionarAvaliacao,
  removerAvaliacao,
} from "@/app/painel/(protected)/avaliacoes/actions";
import type { AvaliacaoGoogle } from "@/lib/avaliacoes";

export function PainelAvaliacoes({ avaliacoes }: { avaliacoes: AvaliacaoGoogle[] }) {
  const [aAdicionar, setAAdicionar] = useState(false);

  return (
    <div>
      <div className="mb-8">
        <button
          type="button"
          onClick={() => setAAdicionar((v) => !v)}
          className="rounded-md border border-grid px-4 py-2 text-sm font-semibold transition hover:bg-brand-blue/5"
        >
          {aAdicionar ? "Cancelar" : "+ Adicionar avaliação"}
        </button>

        {aAdicionar && (
          <form
            action={adicionarAvaliacao}
            onSubmit={() => setAAdicionar(false)}
            className="mt-4 grid gap-3 rounded-xl border border-grid p-5 sm:grid-cols-2"
          >
            <label className="text-xs">
              <span className="mb-1 block text-foreground-secondary">Nome do autor</span>
              <input
                name="nome_autor"
                required
                className="w-full rounded-md border border-grid bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs">
              <span className="mb-1 block text-foreground-secondary">Estrelas</span>
              <select
                name="estrelas"
                defaultValue="5"
                className="w-full rounded-md border border-grid bg-background px-3 py-2 text-sm"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs sm:col-span-2">
              <span className="mb-1 block text-foreground-secondary">Texto da avaliação</span>
              <textarea
                name="texto"
                required
                rows={3}
                className="w-full rounded-md border border-grid bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs sm:col-span-2">
              <span className="mb-1 block text-foreground-secondary">
                Link da avaliação no Google (opcional)
              </span>
              <input
                name="url_avaliacao"
                type="url"
                className="w-full rounded-md border border-grid bg-background px-3 py-2 text-sm"
              />
            </label>
            <button
              type="submit"
              className="sm:col-span-2 w-fit rounded-md bg-brand-blue px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Guardar
            </button>
          </form>
        )}
      </div>

      {avaliacoes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-grid p-6 text-sm text-foreground-secondary">
          Ainda sem avaliações registadas.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {avaliacoes.map((a) => (
            <div key={a.id} className="rounded-xl border border-grid p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex gap-0.5 text-brand-blue">
                  {Array.from({ length: a.estrelas }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>
                <form action={removerAvaliacao}>
                  <input type="hidden" name="id" value={a.id} />
                  <button
                    type="submit"
                    className="text-xs text-foreground-secondary hover:text-brand-red"
                  >
                    Remover
                  </button>
                </form>
              </div>
              <p className="text-sm text-foreground-secondary">“{a.texto}”</p>
              <p className="mt-2 text-sm font-semibold">— {a.nome_autor}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
