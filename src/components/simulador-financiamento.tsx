"use client";

import { useActionState, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Calculator, ExternalLink } from "lucide-react";
import { simularFinanciamento, formatarEuro } from "@/lib/financiamento";
import {
  enviarSimulacaoFinanciamento,
  type EstadoEnvioSimulacao,
} from "@/app/[locale]/(public)/imoveis/[ref]/financiamento-actions";
import { CampoAntiSpam } from "@/components/campo-anti-spam";

const CAMPO =
  "w-full rounded-md border border-grid bg-background px-3 py-2 text-sm outline-none focus:border-brand-blue";

const ESTADO_INICIAL: EstadoEnvioSimulacao = { ok: false };

export function SimuladorFinanciamento({
  imovelId,
  precoPedido,
}: {
  imovelId: string;
  precoPedido: number | null;
}) {
  const t = useTranslations("financing");
  const [aberto, setAberto] = useState(false);
  const [valorImovel, setValorImovel] = useState(precoPedido ?? 200000);
  const [entrada, setEntrada] = useState(Math.round((precoPedido ?? 200000) * 0.1));
  const [taxaTan, setTaxaTan] = useState(3.2);
  const [prazoAnos, setPrazoAnos] = useState(30);
  const [rendimentoLiquido, setRendimentoLiquido] = useState<number | "">("");

  const resultado = useMemo(
    () =>
      simularFinanciamento({
        valorImovel,
        entrada,
        taxaTanPercent: taxaTan,
        prazoAnos,
        rendimentoLiquido: rendimentoLiquido === "" ? null : rendimentoLiquido,
      }),
    [valorImovel, entrada, taxaTan, prazoAnos, rendimentoLiquido],
  );

  const [estado, submeter, aEnviar] = useActionState(
    enviarSimulacaoFinanciamento,
    ESTADO_INICIAL,
  );

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="mt-8 flex w-full items-center justify-between gap-3 rounded-xl border border-brand-blue/30 bg-brand-blue/[0.03] p-5 text-left transition hover:border-brand-blue"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
            <Calculator size={20} />
          </div>
          <div>
            <p className="font-bold">{t("cardTitle")}</p>
            <p className="text-sm text-foreground-secondary">
              {t("cardSubtitle")}
            </p>
          </div>
        </div>
        <span className="text-sm font-semibold text-brand-blue">{t("cta")}</span>
      </button>
    );
  }

  return (
    <div className="mt-8 rounded-xl border border-brand-blue/30 bg-brand-blue/[0.03] p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
          <Calculator size={20} />
        </div>
        <p className="font-bold">{t("panelTitle")}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-medium text-foreground-secondary">
          {t("propertyValue")}
          <input
            type="number"
            className={`mt-1 ${CAMPO}`}
            value={valorImovel}
            onChange={(e) => setValorImovel(Number(e.target.value) || 0)}
          />
        </label>
        <label className="text-xs font-medium text-foreground-secondary">
          {t("downPayment")}
          <input
            type="number"
            className={`mt-1 ${CAMPO}`}
            value={entrada}
            onChange={(e) => setEntrada(Number(e.target.value) || 0)}
          />
        </label>
        <label className="text-xs font-medium text-foreground-secondary">
          {t("annualRate")}
          <input
            type="number"
            step="0.1"
            className={`mt-1 ${CAMPO}`}
            value={taxaTan}
            onChange={(e) => setTaxaTan(Number(e.target.value) || 0)}
          />
        </label>
        <label className="text-xs font-medium text-foreground-secondary">
          {t("termYears")}
          <input
            type="number"
            className={`mt-1 ${CAMPO}`}
            value={prazoAnos}
            onChange={(e) => setPrazoAnos(Number(e.target.value) || 0)}
          />
        </label>
        <label className="text-xs font-medium text-foreground-secondary sm:col-span-2">
          {t("netIncome")}
          <input
            type="number"
            className={`mt-1 ${CAMPO}`}
            value={rendimentoLiquido}
            onChange={(e) =>
              setRendimentoLiquido(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </label>
      </div>

      {resultado && (
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-grid bg-background p-4 sm:grid-cols-4">
          <Resultado rotulo={t("monthlyPayment")} valor={formatarEuro(resultado.prestacaoMensal)} destaque />
          <Resultado rotulo={t("financedAmount")} valor={formatarEuro(resultado.montanteFinanciado)} />
          <Resultado rotulo={t("ltv")} valor={`${resultado.ltv.toFixed(0)}%`} />
          <Resultado
            rotulo={t("debtRatio")}
            valor={resultado.taxaEsforco !== null ? `${resultado.taxaEsforco.toFixed(0)}%` : "—"}
          />
        </div>
      )}

      <p className="mt-3 text-xs text-foreground-secondary">
        {t("disclaimer")}{" "}
        <a
          href="https://maxfinancedelta.com/simuladores"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-medium text-brand-blue hover:underline"
        >
          {t("simulateOthers")} <ExternalLink size={11} />
        </a>
      </p>

      {estado.ok ? (
        <p className="mt-4 rounded-lg bg-brand-blue/10 p-3 text-sm font-medium text-brand-blue">
          {t("requestSent")}
        </p>
      ) : (
        <form action={submeter} className="mt-4 flex flex-col gap-3 border-t border-grid pt-4">
          <CampoAntiSpam />
          <p className="text-sm font-semibold">{t("formTitle")}</p>
          <input type="hidden" name="imovelId" value={imovelId} />
          <input type="hidden" name="valorImovel" value={valorImovel} />
          <input type="hidden" name="entrada" value={entrada} />
          <input type="hidden" name="taxaTan" value={taxaTan} />
          <input type="hidden" name="prazoAnos" value={prazoAnos} />
          <input type="hidden" name="rendimentoLiquido" value={rendimentoLiquido} />
          <input type="hidden" name="prestacaoMensal" value={resultado?.prestacaoMensal ?? 0} />
          <input type="hidden" name="montanteFinanciado" value={resultado?.montanteFinanciado ?? 0} />
          <input type="hidden" name="ltv" value={resultado?.ltv ?? 0} />
          <input type="hidden" name="taxaEsforco" value={resultado?.taxaEsforco ?? ""} />

          <div className="grid gap-3 sm:grid-cols-3">
            <input name="nome" required placeholder={t("name")} className={CAMPO} />
            <input name="email" type="email" required placeholder={t("email")} className={CAMPO} />
            <input name="telefone" type="tel" placeholder={t("phoneOptional")} className={CAMPO} />
          </div>

          <label className="flex items-start gap-2 text-xs text-foreground-secondary">
            <input type="checkbox" name="consentimento" required className="mt-0.5" />
            {t("consent")}
          </label>

          {estado.erro && <p className="text-sm text-brand-red">{estado.erro}</p>}

          <button
            type="submit"
            disabled={aEnviar}
            className="w-fit rounded-md bg-brand-blue px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {aEnviar ? t("sending") : t("submit")}
          </button>
        </form>
      )}
    </div>
  );
}

function Resultado({
  rotulo,
  valor,
  destaque = false,
}: {
  rotulo: string;
  valor: string;
  destaque?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-foreground-secondary">{rotulo}</p>
      <p className={`font-bold ${destaque ? "text-lg text-brand-blue" : ""}`}>{valor}</p>
    </div>
  );
}
