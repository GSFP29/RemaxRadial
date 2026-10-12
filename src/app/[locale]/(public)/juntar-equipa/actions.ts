"use server";

import { getTranslations } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { passouAntiSpam } from "@/lib/anti-spam";

export type EstadoCandidatura = { ok: boolean; erro?: string };

export async function enviarCandidatura(
  _estadoAnterior: EstadoCandidatura | null,
  formData: FormData,
): Promise<EstadoCandidatura> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const mensagem = String(formData.get("mensagem") ?? "").trim();
  const t = await getTranslations("errors");

  if (!passouAntiSpam(formData)) return { ok: true };

  if (!nome || !email || !telefone) {
    return { ok: false, erro: t("recruitRequired") };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("leads").insert({
    origem: "formulario_site",
    nome,
    telefone,
    email,
    mensagem: `Candidatura a consultor — ${mensagem || "sem mensagem adicional"}`,
  });

  if (error) {
    return { ok: false, erro: t("sendFailed") };
  }

  return { ok: true };
}
