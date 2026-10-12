"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { enviarPedidoVenda, type EstadoEnvioVenda } from "@/app/[locale]/(public)/vender/actions";
import { DISTRITOS, TIPOS_IMOVEL_VENDA } from "@/lib/vender-formato";
import { CampoAntiSpam } from "@/components/campo-anti-spam";

const CAMPO =
  "w-full rounded-md border border-grid bg-background px-3 py-2.5 text-sm outline-none focus:border-brand-blue";

const ESTADO_INICIAL: EstadoEnvioVenda = { ok: false };

export function FormularioVender() {
  const t = useTranslations("sell");
  const [estado, submeter, aEnviar] = useActionState(enviarPedidoVenda, ESTADO_INICIAL);

  if (estado.ok) {
    return (
      <div className="rounded-xl border border-brand-blue/30 bg-brand-blue/[0.03] p-8 text-center">
        <p className="text-lg font-bold text-brand-blue">{t("successTitle")}</p>
        <p className="mt-2 text-sm text-foreground-secondary">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form action={submeter} className="flex flex-col gap-4">
      <CampoAntiSpam />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">
          {t("formName")}
          <input name="nome" required className={`mt-1 ${CAMPO}`} />
        </label>
        <label className="text-sm font-medium">
          {t("formEmail")}
          <input name="email" type="email" required className={`mt-1 ${CAMPO}`} />
        </label>
        <label className="text-sm font-medium">
          {t("formPhone")}
          <input name="telefone" type="tel" required className={`mt-1 ${CAMPO}`} />
        </label>
        <label className="text-sm font-medium">
          {t("formPropertyType")}
          <select name="tipoImovel" required defaultValue="" className={`mt-1 ${CAMPO}`}>
            <option value="" disabled>
              {t("formChoose")}
            </option>
            {TIPOS_IMOVEL_VENDA.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-medium">
          {t("formDistrict")}
          <select name="distrito" required defaultValue="" className={`mt-1 ${CAMPO}`}>
            <option value="" disabled>
              {t("formChoose")}
            </option>
            {DISTRITOS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          {t("formCounty")}
          <input name="concelho" required className={`mt-1 ${CAMPO}`} />
        </label>
        <label className="text-sm font-medium">
          {t("formParish")}
          <input name="freguesia" required className={`mt-1 ${CAMPO}`} />
        </label>
      </div>

      {estado.erro && <p className="text-sm text-brand-red">{estado.erro}</p>}

      <button
        type="submit"
        disabled={aEnviar}
        className="mt-2 w-full rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-red/30 transition hover:brightness-110 disabled:opacity-60 sm:w-fit"
      >
        {aEnviar ? t("sending") : t("submit")}
      </button>
      <p className="text-xs text-foreground-secondary">{t("responseTime")}</p>
    </form>
  );
}
