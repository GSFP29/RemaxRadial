"use server";

import { getTranslations } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { passouAntiSpam } from "@/lib/anti-spam";

export type EstadoContacto = { ok: boolean; erro?: string };

export async function enviarContacto(
  _estadoAnterior: EstadoContacto | null,
  formData: FormData,
): Promise<EstadoContacto> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const mensagem = String(formData.get("mensagem") ?? "").trim();
  const t = await getTranslations("errors");

  // Falha silenciosa: um bot não deve saber que foi apanhado — finge
  // sucesso sem gravar nada. Ver src/lib/anti-spam.ts.
  if (!passouAntiSpam(formData)) return { ok: true };

  if (!nome || !email || !mensagem) {
    return { ok: false, erro: t("contactRequired") };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("leads").insert({
    origem: "formulario_site",
    nome,
    telefone: telefone || null,
    email,
    mensagem,
  });

  if (error) {
    return { ok: false, erro: t("sendFailed") };
  }

  return { ok: true };
}
