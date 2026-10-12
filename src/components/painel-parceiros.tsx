"use client";

import { useState } from "react";
import {
  Camera,
  Compass,
  CreditCard,
  HardHat,
  type LucideIcon,
  PaintRoller,
  Printer,
  Scale,
  Sparkles,
  Stamp,
  Truck,
  Zap,
} from "lucide-react";
import { adicionarParceiro, removerParceiro } from "@/app/painel/(protected)/parceiros/actions";
import { CATEGORIAS_PARCEIROS, type Parceiro } from "@/lib/parceiros-formato";

const ICONE_CATEGORIA: Record<string, LucideIcon> = {
  "Fotografia e Vídeo": Camera,
  "Certificação Energética": Zap,
  "Intermediários de Crédito": CreditCard,
  "Solicitadores e Advogados": Scale,
  Notários: Stamp,
  "Obras e Remodelação": HardHat,
  Pintores: PaintRoller,
  Limpezas: Sparkles,
  Arquitetos: Compass,
  Mudanças: Truck,
  Gráficas: Printer,
};

export function PainelParceiros({
  parceiros,
  isAdmin,
}: {
  parceiros: Parceiro[];
  isAdmin: boolean;
}) {
  const [aAdicionar, setAAdicionar] = useState(false);

  const porCategoria = new Map<string, Parceiro[]>();
  for (const p of parceiros) {
    const lista = porCategoria.get(p.categoria) ?? [];
    lista.push(p);
    porCategoria.set(p.categoria, lista);
  }

  return (
    <div>
      {isAdmin && (
        <div className="mb-8">
          <button
            type="button"
            onClick={() => setAAdicionar((v) => !v)}
            className="rounded-md border border-grid px-4 py-2 text-sm font-semibold transition hover:bg-brand-blue/5"
          >
            {aAdicionar ? "Cancelar" : "+ Adicionar parceiro"}
          </button>

          {aAdicionar && (
            <form
              action={adicionarParceiro}
              onSubmit={() => setAAdicionar(false)}
              className="mt-4 grid gap-3 rounded-xl border border-grid p-5 sm:grid-cols-2"
            >
              <label className="text-xs sm:col-span-2">
                <span className="mb-1 block text-foreground-secondary">Categoria</span>
                <select
                  name="categoria"
                  required
                  className="w-full rounded-md border border-grid bg-background px-3 py-2 text-sm"
                >
                  {CATEGORIAS_PARCEIROS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs">
                <span className="mb-1 block text-foreground-secondary">Nome</span>
                <input
                  name="nome"
                  required
                  className="w-full rounded-md border border-grid bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs">
                <span className="mb-1 block text-foreground-secondary">Contacto</span>
                <input
                  name="contacto"
                  className="w-full rounded-md border border-grid bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs sm:col-span-2">
                <span className="mb-1 block text-foreground-secondary">
                  Condições negociadas / notas
                </span>
                <textarea
                  name="condicoes"
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

      <div className="flex flex-col gap-8">
        {CATEGORIAS_PARCEIROS.map((categoria) => {
          const Icone = ICONE_CATEGORIA[categoria];
          const lista = porCategoria.get(categoria) ?? [];
          return (
            <section key={categoria}>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wide text-foreground-secondary uppercase">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-blue/10 text-brand-blue">
                  {Icone && <Icone size={14} />}
                </span>
                {categoria}
              </h2>
              {lista.length === 0 ? (
                <p className="rounded-xl border border-dashed border-grid p-4 text-sm text-foreground-secondary">
                  Ainda sem contactos nesta categoria.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {lista.map((p) => (
                    <div key={p.id} className="rounded-xl border border-grid p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold">{p.nome}</p>
                        {isAdmin && (
                          <form action={removerParceiro}>
                            <input type="hidden" name="id" value={p.id} />
                            <button
                              type="submit"
                              aria-label="Remover"
                              className="text-xs text-foreground-secondary hover:text-brand-red"
                            >
                              Remover
                            </button>
                          </form>
                        )}
                      </div>
                      {p.contacto && (
                        <p className="text-sm text-brand-blue">{p.contacto}</p>
                      )}
                      {p.condicoes && (
                        <p className="mt-1 text-xs text-foreground-secondary">{p.condicoes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
