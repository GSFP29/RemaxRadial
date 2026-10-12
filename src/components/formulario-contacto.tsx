"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { enviarContacto, type EstadoContacto } from "@/app/[locale]/(public)/contacto/actions";
import { CampoAntiSpam } from "@/components/campo-anti-spam";

const CAMPO =
  "w-full rounded-md border border-grid bg-background px-3 py-2.5 text-sm outline-none focus:border-brand-blue";

const ESTADO_INICIAL: EstadoContacto = { ok: false };

export function FormularioContacto() {
  const t = useTranslations("contact");
  const [estado, submeter, aEnviar] = useActionState(enviarContacto, ESTADO_INICIAL);

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
      </div>
      <label className="text-sm font-medium">
        {t("formPhone")}
        <input name="telefone" type="tel" className={`mt-1 ${CAMPO}`} />
      </label>
      <label className="text-sm font-medium">
        {t("formMessage")}
        <textarea name="mensagem" required rows={5} className={`mt-1 ${CAMPO}`} />
      </label>

      {estado.erro && <p className="text-sm text-brand-red">{estado.erro}</p>}

      <button
        type="submit"
        disabled={aEnviar}
        className="mt-2 w-full rounded-md bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-blue/30 transition hover:brightness-110 disabled:opacity-60 sm:w-fit"
      >
        {aEnviar ? t("sending") : t("submit")}
      </button>
      <p className="text-xs text-foreground-secondary">{t("responseTime")}</p>
    </form>
  );
}
