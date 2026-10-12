"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import {
  adicionarRecursoBiblioteca,
  removerRecursoBiblioteca,
} from "@/app/painel/(protected)/biblioteca/actions";
import type { RecursoBiblioteca } from "@/lib/biblioteca";

export function PainelBiblioteca({
  recursos,
  isAdmin,
}: {
  recursos: RecursoBiblioteca[];
  isAdmin: boolean;
}) {
  const [aAdicionar, setAAdicionar] = useState(false);

  return (
    <div>
      {isAdmin && (
        <div className="mb-8">
          <button
            type="button"
            onClick={() => setAAdicionar((v) => !v)}
            className="rounded-md border border-grid px-4 py-2 text-sm font-semibold transition hover:bg-brand-blue/5"
          >
            {aAdicionar ? "Cancelar" : "+ Adicionar conteúdo"}
          </button>

          {aAdicionar && (
            <form
              action={adicionarRecursoBiblioteca}
              onSubmit={() => setAAdicionar(false)}
              className="mt-4 grid gap-3 rounded-xl border border-grid p-5 sm:grid-cols-2"
            >
              <label className="text-xs">
                <span className="mb-1 block text-foreground-secondary">Título</span>
                <input
                  name="titulo"
                  required
                  className="w-full rounded-md border border-grid bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs">
                <span className="mb-1 block text-foreground-secondary">Categoria</span>
                <input
                  name="categoria"
                  placeholder="ex: Negociação, Marketing pessoal..."
                  className="w-full rounded-md border border-grid bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs sm:col-span-2">
                <span className="mb-1 block text-foreground-secondary">
                  Link (Drive, YouTube, PDF...)
                </span>
                <input
                  name="url"
                  type="url"
                  required
                  className="w-full rounded-md border border-grid bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs sm:col-span-2">
                <span className="mb-1 block text-foreground-secondary">Descrição</span>
                <textarea
                  name="descricao"
                  rows={2}
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
      )}

      {recursos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-grid p-6 text-sm text-foreground-secondary">
          Ainda sem conteúdos. {isAdmin && "Usa \"Adicionar conteúdo\" para começar."}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recursos.map((r) => (
            <div key={r.id} className="rounded-xl border border-grid p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                  <BookOpen size={18} />
                </div>
                {isAdmin && (
                  <form action={removerRecursoBiblioteca}>
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      className="text-xs text-foreground-secondary hover:text-brand-red"
                    >
                      Remover
                    </button>
                  </form>
                )}
              </div>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-blue hover:underline"
              >
                {r.titulo}
              </a>
              {r.categoria && (
                <p className="mt-1 text-xs text-foreground-secondary uppercase tracking-wide">
                  {r.categoria}
                </p>
              )}
              {r.descricao && (
                <p className="mt-1 text-sm text-foreground-secondary">{r.descricao}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
