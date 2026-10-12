"use client";

import { useState } from "react";
import { Building2, Megaphone, Target, UserPlus, type LucideIcon } from "lucide-react";
import { guardarMetricasMarketing } from "@/app/painel/(protected)/marketing/actions";
import type { MetricaMensal } from "@/lib/marketing-admin";
import {
  CATEGORIAS,
  METRICAS,
  estadoMetrica,
  formatarMesPt,
  formatarMetaMetrica,
  formatarValorMetrica,
  type Metrica,
} from "@/lib/marketing-formato";
import { CHIP_COR, type CorCartao } from "@/components/ui/cartoes";

type Props = {
  metricas: MetricaMensal[];
  mesAtual: string;
  mesAnterior: string;
};

const ICONE_CATEGORIA: Record<string, LucideIcon> = {
  banco_produtos: Building2,
  presenca_digital: Megaphone,
  trafego_pago: Target,
  recrutamento: UserPlus,
};

const COR_CARTAO_CATEGORIA: Record<string, CorCartao> = {
  banco_produtos: "chart2",
  presenca_digital: "chart1",
  trafego_pago: "chart3",
  recrutamento: "chart4",
};

export function DashboardMarketing({ metricas, mesAtual, mesAnterior }: Props) {
  const [aEditar, setAEditar] = useState(false);

  const porChaveEMes = new Map<string, number>();
  for (const m of metricas) {
    porChaveEMes.set(`${m.mes}:${m.chave}`, m.valor);
  }
  const valorEm = (mes: string, chave: string) => porChaveEMes.get(`${mes}:${chave}`) ?? null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground-secondary">
          A mostrar {formatarMesPt(mesAtual)}
        </p>
        <button
          type="button"
          onClick={() => setAEditar((v) => !v)}
          className="rounded-md border border-grid px-4 py-2 text-sm font-semibold transition hover:bg-brand-blue/5"
        >
          {aEditar ? "Cancelar" : "Atualizar métricas do mês"}
        </button>
      </div>

      {aEditar && (
        <form
          action={guardarMetricasMarketing}
          onSubmit={() => setAEditar(false)}
          className="mb-10 rounded-lg border border-grid p-6"
        >
          <input type="hidden" name="mes" value={mesAtual} />
          <p className="mb-4 text-sm font-semibold">
            Valores de {formatarMesPt(mesAtual)} — deixa em branco o que não
            mudou
          </p>

          {CATEGORIAS.map((cat) => (
            <div key={cat.chave} className="mb-6 last:mb-4">
              <h3 className={`mb-2 flex items-center gap-2 text-xs font-bold tracking-wide uppercase ${cat.corClasse}`}>
                <CategoriaIcone chave={cat.chave} />
                {cat.rotulo}
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {METRICAS.filter((m) => m.categoria === cat.chave).map((m) => (
                  <label key={m.chave} className="text-xs">
                    <span className="mb-1 block text-foreground-secondary">
                      {m.rotulo}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      name={m.chave}
                      defaultValue={valorEm(mesAtual, m.chave) ?? ""}
                      placeholder="—"
                      className="w-full rounded border border-grid px-2 py-1.5 text-sm"
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="rounded-md bg-brand-blue px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Guardar
          </button>
        </form>
      )}

      {CATEGORIAS.map((cat) => (
        <section key={cat.chave} className="mb-10">
          <h2 className={`mb-3 flex items-center gap-2 text-sm font-bold tracking-wide uppercase ${cat.corClasse}`}>
            <CategoriaIcone chave={cat.chave} tamanho={16} />
            {cat.rotulo}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {METRICAS.filter((m) => m.categoria === cat.chave).map((m) => (
              <CartaoMetrica
                key={m.chave}
                metrica={m}
                atual={valorEm(mesAtual, m.chave)}
                anterior={valorEm(mesAnterior, m.chave)}
                cor={COR_CARTAO_CATEGORIA[cat.chave]}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CategoriaIcone({ chave, tamanho = 12 }: { chave: string; tamanho?: number }) {
  const Icone = ICONE_CATEGORIA[chave];
  return Icone ? <Icone size={tamanho} strokeWidth={2.5} /> : null;
}

function CartaoMetrica({
  metrica,
  atual,
  anterior,
  cor,
}: {
  metrica: Metrica;
  atual: number | null;
  anterior: number | null;
  cor: CorCartao;
}) {
  const estado = atual !== null ? estadoMetrica(metrica, atual) : "neutro";
  const Icone = ICONE_CATEGORIA[metrica.categoria];

  return (
    <div className="rounded-xl border border-grid p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-xs text-foreground-secondary">{metrica.rotulo}</p>
        {Icone && (
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${CHIP_COR[cor]}`}
          >
            <Icone size={14} strokeWidth={2} />
          </div>
        )}
      </div>
      <p className={`text-2xl font-bold ${estado === "mau" ? "text-brand-red" : ""}`}>
        {atual !== null ? formatarValorMetrica(metrica, atual) : "—"}
      </p>
      <p className="text-xs text-foreground-secondary">{formatarMetaMetrica(metrica)}</p>
      {anterior !== null && (
        <p className="mt-1 text-xs text-foreground-secondary">
          Mês anterior: {formatarValorMetrica(metrica, anterior)}
        </p>
      )}
    </div>
  );
}
