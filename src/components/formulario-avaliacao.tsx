"use client";

import { useActionState } from "react";
import {
  calcularEstimativa,
  enviarPedidoAvaliacao,
  type EstadoPedidoAvaliacao,
  type EstimativaResultado,
} from "@/app/[locale]/(public)/avaliar/actions";
import { AMOSTRA_MINIMA, TIPOLOGIAS_AVALIACAO, formatarEuro } from "@/lib/avaliacao-formato";
import type { ReferenciaIne } from "@/lib/ine";
import type { ReferenciaMaxwork } from "@/lib/referencias-maxwork";

const CAMPO =
  "w-full rounded-md border border-grid bg-background px-3 py-2.5 text-sm outline-none focus:border-brand-blue";

const ESTADO_ESTIMATIVA: EstimativaResultado = { ok: false };
const ESTADO_PEDIDO: EstadoPedidoAvaliacao = { ok: false };

export function FormularioAvaliacao({ concelhos }: { concelhos: string[] }) {
  const [estimativa, calcular, aCalcular] = useActionState(calcularEstimativa, ESTADO_ESTIMATIVA);
  const [pedido, submeterPedido, aEnviarPedido] = useActionState(
    enviarPedidoAvaliacao,
    ESTADO_PEDIDO,
  );

  if (pedido.ok) {
    return (
      <div className="rounded-xl border border-brand-blue/30 bg-brand-blue/[0.03] p-8 text-center">
        <p className="text-lg font-bold text-brand-blue">Pedido recebido!</p>
        <p className="mt-2 text-sm text-foreground-secondary">
          Um dos nossos consultores entra em contacto para uma avaliação
          presencial gratuita, sem compromisso.
        </p>
      </div>
    );
  }

  if (!estimativa.ok) {
    return (
      <form action={calcular} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Concelho
            <select name="concelho" required defaultValue="" className={`mt-1 ${CAMPO}`}>
              <option value="" disabled>
                Escolher...
              </option>
              {concelhos.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Freguesia (opcional)
            <input name="freguesia" className={`mt-1 ${CAMPO}`} />
          </label>
          <label className="text-sm font-medium">
            Tipologia
            <select name="tipologia" required defaultValue="" className={`mt-1 ${CAMPO}`}>
              <option value="" disabled>
                Escolher...
              </option>
              {TIPOLOGIAS_AVALIACAO.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Área (m²)
            <input name="areaM2" type="number" min="1" required className={`mt-1 ${CAMPO}`} />
          </label>
        </div>

        {estimativa.erro && <p className="text-sm text-brand-red">{estimativa.erro}</p>}

        <button
          type="submit"
          disabled={aCalcular}
          className="mt-2 w-full rounded-md bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-blue/30 transition hover:brightness-110 disabled:opacity-60 sm:w-fit"
        >
          {aCalcular ? "A calcular..." : "Ver estimativa"}
        </button>
      </form>
    );
  }

  const temEstimativa = (estimativa.amostraN ?? 0) >= AMOSTRA_MINIMA;

  return (
    <div className="flex flex-col gap-6">
      {temEstimativa ? (
        <div className="rounded-xl border border-brand-blue/30 bg-brand-blue/[0.03] p-6 text-center">
          <p className="text-sm font-medium text-foreground-secondary">Valor estimado</p>
          <p className="mt-1 text-3xl font-bold text-brand-blue">
            {formatarEuro(estimativa.estimativaMin!)} – {formatarEuro(estimativa.estimativaMax!)}
          </p>
          <p className="mt-2 text-xs text-foreground-secondary">
            Com base em {estimativa.amostraN} imóveis semelhantes atualmente à venda na zona.
            Estimativa indicativa — não substitui uma avaliação presencial.
          </p>

          <EspectroPreco estimativa={estimativa} />
        </div>
      ) : (
        <div className="rounded-xl border border-grid p-6 text-center">
          <p className="text-sm font-medium">
            Ainda não temos imóveis suficientes nesta zona para uma estimativa online fiável.
          </p>
          <p className="mt-2 text-xs text-foreground-secondary">
            Mas um dos nossos consultores pode fazer uma avaliação presencial gratuita — deixa o
            teu contacto abaixo.
          </p>
        </div>
      )}

      {(estimativa.referenciaIne || estimativa.referenciaMaxwork) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {estimativa.referenciaIne && <ReferenciaIneBloco referencia={estimativa.referenciaIne} />}
          {estimativa.referenciaMaxwork && (
            <ReferenciaMaxworkBloco referencia={estimativa.referenciaMaxwork} />
          )}
        </div>
      )}

      <form action={submeterPedido} className="flex flex-col gap-4">
        <input type="hidden" name="concelho" value={estimativa.concelho} />
        <input type="hidden" name="freguesia" value={estimativa.freguesia} />
        <input type="hidden" name="tipologia" value={estimativa.tipologia} />
        <input type="hidden" name="areaM2" value={estimativa.areaM2} />
        <input type="hidden" name="amostraN" value={estimativa.amostraN} />
        <input type="hidden" name="precoM2Mediano" value={estimativa.precoM2Mediano ?? ""} />
        <input type="hidden" name="estimativaMin" value={estimativa.estimativaMin ?? ""} />
        <input type="hidden" name="estimativaMax" value={estimativa.estimativaMax ?? ""} />

        <p className="text-sm font-semibold">
          {temEstimativa
            ? "Quero uma avaliação presencial gratuita para confirmar este valor"
            : "Pedir avaliação presencial gratuita"}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Nome
            <input name="nome" required className={`mt-1 ${CAMPO}`} />
          </label>
          <label className="text-sm font-medium">
            Email
            <input name="email" type="email" required className={`mt-1 ${CAMPO}`} />
          </label>
          <label className="text-sm font-medium sm:col-span-2">
            Telefone
            <input name="telefone" type="tel" className={`mt-1 ${CAMPO}`} />
          </label>
        </div>

        {pedido.erro && <p className="text-sm text-brand-red">{pedido.erro}</p>}

        <button
          type="submit"
          disabled={aEnviarPedido}
          className="w-full rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-red/30 transition hover:brightness-110 disabled:opacity-60 sm:w-fit"
        >
          {aEnviarPedido ? "A enviar..." : "Pedir avaliação gratuita"}
        </button>
      </form>
    </div>
  );
}

// Espectro de mercado — 4 bandas a partir dos quartis reais dos
// comparáveis (não de dados externos). Larguras iguais de propósito:
// cada banda representa 25% da amostra observada, não 25% do intervalo
// de preços (que ficaria distorcido por valores extremos).
function EspectroPreco({ estimativa }: { estimativa: EstimativaResultado }) {
  if (!estimativa.espectroP10 || !estimativa.espectroP90) return null;

  const bandas = [
    { rotulo: "Subvalorizado", cor: "bg-chart-1" },
    { rotulo: "Abaixo da média", cor: "bg-chart-3" },
    { rotulo: "Acima da média", cor: "bg-chart-4" },
    { rotulo: "Sobrevalorizado", cor: "bg-chart-2" },
  ];

  return (
    <div className="mt-5 text-left">
      <p className="mb-2 text-center text-xs font-semibold text-foreground-secondary">
        Onde este valor se situa no mercado da zona
      </p>
      <div className="flex overflow-hidden rounded-full">
        {bandas.map((b) => (
          <div key={b.rotulo} className={`h-2 flex-1 ${b.cor}`} />
        ))}
      </div>
      <div className="mt-1 flex text-[10px] text-foreground-secondary">
        {bandas.map((b) => (
          <div key={b.rotulo} className="flex-1 text-center">
            {b.rotulo}
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-foreground-secondary">
        <span>{formatarEuro(estimativa.espectroP10!)}</span>
        <span>{formatarEuro(estimativa.espectroP50!)}</span>
        <span>{formatarEuro(estimativa.espectroP90!)}</span>
      </div>
    </div>
  );
}

// Referência oficial INE (avaliação bancária) — fonte externa e
// independente da nossa carteira, mostrada lado a lado com a nossa
// estimativa em vez de fundida nela, para ficar claro qual é qual.
function ReferenciaIneBloco({ referencia }: { referencia: ReferenciaIne }) {
  const variacao = referencia.variacaoHomologa;
  const aSubir = variacao !== null && variacao > 0;
  const aDescer = variacao !== null && variacao < 0;

  return (
    <div className="rounded-xl border border-grid p-5 text-center">
      <p className="text-xs font-semibold text-foreground-secondary">
        Referência oficial · INE, avaliação bancária
      </p>
      <p className="mt-1 text-xl font-bold">{formatarEuro(referencia.valorM2)}/m²</p>
      <p className="mt-1 text-xs text-foreground-secondary">
        Valor mediano em {referencia.periodo.toLowerCase()}
        {variacao !== null && referencia.regiao && (
          <>
            {" · "}
            <span
              className={
                aSubir ? "font-semibold text-brand-red" : aDescer ? "font-semibold text-brand-blue" : ""
              }
            >
              {aSubir ? "▲" : aDescer ? "▼" : ""} {variacao > 0 ? "+" : ""}
              {variacao.toLocaleString("pt-PT", { maximumFractionDigits: 1 })}%
            </span>{" "}
            em {referencia.regiao} nos últimos 12 meses
          </>
        )}
      </p>
    </div>
  );
}

// Referência de vendas reais na rede RE/MAX (MAXWORK) — complementa o INE
// com dados de fecho (não avaliação bancária) e tempo de mercado.
function ReferenciaMaxworkBloco({ referencia }: { referencia: ReferenciaMaxwork }) {
  return (
    <div className="rounded-xl border border-grid p-5 text-center">
      <p className="text-xs font-semibold text-foreground-secondary">
        Vendas reais · rede RE/MAX
      </p>
      <p className="mt-1 text-xl font-bold">{formatarEuro(referencia.precoM2Mediano)}/m²</p>
      <p className="mt-1 text-xs text-foreground-secondary">
        Mediana de {referencia.amostraN} imóveis vendidos nos últimos{" "}
        {referencia.periodoMeses} meses
        {referencia.medianaDiasMercado !== null && (
          <> · {Math.round(referencia.medianaDiasMercado)} dias até vender, em média</>
        )}
      </p>
    </div>
  );
}
