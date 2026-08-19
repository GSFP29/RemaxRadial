"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  BENCHMARKS,
  diasEmCarteira,
  formatarData,
  formatarPrecoDashboard,
  medianaBenchmarkPara,
  teveDescidaPreco,
  type AlteracaoImovel,
  type ImovelDashboard,
} from "@/lib/dashboard-formato";

type Props = {
  imoveis: ImovelDashboard[];
  alteracoesPorImovel: Record<string, AlteracaoImovel[]>;
};

function mediana(valores: number[]): number | null {
  if (valores.length === 0) return null;
  const ordenados = [...valores].sort((a, b) => a - b);
  const meio = Math.floor(ordenados.length / 2);
  return ordenados.length % 2 === 0
    ? Math.round((ordenados[meio - 1] + ordenados[meio]) / 2)
    : ordenados[meio];
}

export function DashboardImoveis({ imoveis, alteracoesPorImovel }: Props) {
  const [selecionado, setSelecionado] = useState<ImovelDashboard | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const linhas = useMemo(
    () =>
      [...imoveis]
        .map((imovel) => ({ imovel, dias: diasEmCarteira(imovel) }))
        .sort((a, b) => (b.dias ?? 0) - (a.dias ?? 0)),
    [imoveis],
  );

  const stats = useMemo(() => {
    const dias = linhas
      .map((l) => l.dias)
      .filter((d): d is number => d !== null);
    const comDescida = imoveis.filter(teveDescidaPreco).length;
    const maisDeUmAno = dias.filter((d) => d > 365).length;
    return {
      total: imoveis.length,
      idadeMediana: mediana(dias),
      comDescida,
      maisDeUmAno,
    };
  }, [imoveis, linhas]);

  function abrir(imovel: ImovelDashboard) {
    setSelecionado(imovel);
    dialogRef.current?.showModal();
  }

  function fechar() {
    dialogRef.current?.close();
  }

  const historico = selecionado
    ? (alteracoesPorImovel[selecionado.id] ?? [])
    : [];

  return (
    <div>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <CartaoStat
          rotulo="Em mercado"
          valor={String(stats.total)}
          referencia="Ago 2026: 87"
        />
        <CartaoStat
          rotulo="Idade mediana"
          valor={stats.idadeMediana !== null ? `${stats.idadeMediana} dias` : "—"}
          referencia={`Ago 2026: ${BENCHMARKS.idadeMedianaSnapshot} dias`}
        />
        <CartaoStat
          rotulo="Com descida de preço"
          valor={String(stats.comDescida)}
          referencia={`Ago 2026: ${BENCHMARKS.imoveisComDescidaSnapshot}`}
        />
        <CartaoStat
          rotulo="Mais de 1 ano em carteira"
          valor={String(stats.maisDeUmAno)}
          referencia={`Ago 2026: ${BENCHMARKS.maisDeUmAnoSnapshot}`}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-grid">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-grid bg-brand-blue/[0.03] text-left text-foreground-secondary">
              <Th>Imóvel</Th>
              <Th>Consultor</Th>
              <Th>Zona</Th>
              <Th>Dias em carteira</Th>
              <Th>Preço</Th>
              <Th>Estado</Th>
            </tr>
          </thead>
          <tbody>
            {linhas.map(({ imovel, dias }) => {
              const medianaTipo = medianaBenchmarkPara(imovel.tipo);
              const acimaDaMediana = dias !== null && dias > medianaTipo;
              return (
                <tr
                  key={imovel.id}
                  onClick={() => abrir(imovel)}
                  className="cursor-pointer border-b border-grid last:border-0 hover:bg-brand-blue/[0.03]"
                >
                  <Td>
                    <span className="font-medium">{imovel.ref_remax}</span>
                    {imovel.tipo_imovel && (
                      <span className="ml-1 text-foreground-secondary">
                        · {imovel.tipo_imovel}
                      </span>
                    )}
                  </Td>
                  <Td>{imovel.dados_api?.userName ?? "—"}</Td>
                  <Td>{imovel.freguesia ?? "—"}</Td>
                  <Td>
                    <span
                      className={acimaDaMediana ? "font-semibold text-brand-red" : ""}
                    >
                      {dias ?? "—"}
                    </span>
                    <span className="ml-1 text-xs text-foreground-secondary">
                      / {medianaTipo}
                    </span>
                  </Td>
                  <Td>
                    {formatarPrecoDashboard(imovel.preco_pedido)}
                    {teveDescidaPreco(imovel) && (
                      <span className="ml-2 rounded-full bg-brand-red/10 px-2 py-0.5 text-xs font-semibold text-brand-red">
                        ↓ {imovel.dados_api?.priceReductionPercentageValue ?? ""}%
                      </span>
                    )}
                  </Td>
                  <Td className="capitalize">{imovel.estado}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <dialog
        ref={dialogRef}
        onClick={fechar}
        className="w-full max-w-2xl rounded-lg border-none p-0 backdrop:bg-black/50"
      >
        {selecionado && (
          <div onClick={(e) => e.stopPropagation()} className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">{selecionado.ref_remax}</h2>
                <p className="text-sm text-foreground-secondary">
                  {[selecionado.tipo_imovel, selecionado.freguesia, selecionado.concelho]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <button
                type="button"
                onClick={fechar}
                aria-label="Fechar"
                className="text-xl text-foreground-secondary hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <dl className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Detalhe rotulo="Preço atual" valor={formatarPrecoDashboard(selecionado.preco_pedido)} />
              <Detalhe
                rotulo="Preço anterior"
                valor={
                  selecionado.dados_api?.previousPrice != null
                    ? formatarPrecoDashboard(selecionado.dados_api.previousPrice)
                    : "—"
                }
              />
              <Detalhe
                rotulo="Dias em carteira"
                valor={String(diasEmCarteira(selecionado) ?? "—")}
              />
              <Detalhe
                rotulo="Mediana de referência"
                valor={`${medianaBenchmarkPara(selecionado.tipo)} dias`}
              />
              <Detalhe rotulo="Angariado em" valor={formatarData(selecionado.data_angariacao)} />
              <Detalhe rotulo="Consultor" valor={selecionado.dados_api?.userName ?? "—"} />
            </dl>

            <div className="mb-4 flex gap-3 text-sm">
              <Link
                href={`/imoveis/${selecionado.ref_remax}`}
                target="_blank"
                className="font-semibold text-brand-blue"
              >
                Ver ficha pública →
              </Link>
            </div>

            <h3 className="mb-2 text-sm font-semibold text-foreground-secondary">
              Histórico de alterações
            </h3>
            {historico.length === 0 ? (
              <p className="text-sm text-foreground-secondary">
                Sem alterações registadas desde que a ingestão começou.
              </p>
            ) : (
              <ul className="flex flex-col gap-2 text-sm">
                {historico.map((a) => (
                  <li key={a.id} className="border-b border-grid pb-2 last:border-0">
                    <span className="font-medium capitalize">{a.campo}</span>:{" "}
                    {a.valor_anterior ?? "—"} → {a.valor_novo ?? "—"}
                    <span className="ml-2 text-xs text-foreground-secondary">
                      {formatarData(a.criado_em)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}

function CartaoStat({
  rotulo,
  valor,
  referencia,
}: {
  rotulo: string;
  valor: string;
  referencia: string;
}) {
  return (
    <div className="rounded-lg border border-grid p-4">
      <p className="text-xs text-foreground-secondary">{rotulo}</p>
      <p className="text-2xl font-bold">{valor}</p>
      <p className="text-xs text-foreground-secondary">{referencia}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-medium">{children}</th>;
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}

function Detalhe({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt className="text-xs text-foreground-secondary">{rotulo}</dt>
      <dd className="font-medium">{valor}</dd>
    </div>
  );
}
