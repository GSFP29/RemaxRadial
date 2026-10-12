"use server";

import { getTranslations } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { passouAntiSpam } from "@/lib/anti-spam";

export type EstadoEnvioVenda = { ok: boolean; erro?: string };

export async function enviarPedidoVenda(
  _estadoAnterior: EstadoEnvioVenda | null,
  formData: FormData,
): Promise<EstadoEnvioVenda> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const tipoImovel = String(formData.get("tipoImovel") ?? "").trim();
  const distrito = String(formData.get("distrito") ?? "").trim();
  const concelho = String(formData.get("concelho") ?? "").trim();
  const freguesia = String(formData.get("freguesia") ?? "").trim();
  const t = await getTranslations("errors");

  if (!passouAntiSpam(formData)) return { ok: true };

  if (!nome || !email || !telefone || !tipoImovel || !distrito || !concelho || !freguesia) {
    return { ok: false, erro: t("sellRequired") };
  }

  const supabase = createAdminClient();

  const { data: lead, error: erroLead } = await supabase
    .from("leads")
    .insert({
      origem: "formulario_site",
      nome,
      telefone,
      email,
      mensagem: `Pedido de avaliação/venda — ${tipoImovel}, ${freguesia}, ${concelho}, ${distrito}`,
    })
    .select("id")
    .single();

  if (erroLead) {
    return { ok: false, erro: t("sendFailed") };
  }

  const { error: erroPedido } = await supabase.from("pedidos_venda").insert({
    lead_id: lead.id,
    nome,
    email,
    telefone,
    tipo_imovel: tipoImovel,
    distrito,
    concelho,
    freguesia,
  });

  if (erroPedido) {
    return { ok: false, erro: t("sendFailed") };
  }

  return { ok: true };
}
