"use server";

import { getTranslations } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { passouAntiSpam } from "@/lib/anti-spam";

export type EstadoEnvioSimulacao = { ok: boolean; erro?: string };

export async function enviarSimulacaoFinanciamento(
  _estadoAnterior: EstadoEnvioSimulacao | null,
  formData: FormData,
): Promise<EstadoEnvioSimulacao> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const imovelId = String(formData.get("imovelId") ?? "").trim();
  const consentimento = formData.get("consentimento");

  const valorImovel = Number(formData.get("valorImovel"));
  const entrada = Number(formData.get("entrada"));
  const taxaTan = Number(formData.get("taxaTan"));
  const prazoAnos = Number(formData.get("prazoAnos"));
  const rendimentoLiquido = Number(formData.get("rendimentoLiquido")) || null;
  const prestacaoMensal = Number(formData.get("prestacaoMensal"));
  const montanteFinanciado = Number(formData.get("montanteFinanciado"));
  const ltv = Number(formData.get("ltv"));
  const taxaEsforco = Number(formData.get("taxaEsforco")) || null;
  const t = await getTranslations("errors");

  if (!passouAntiSpam(formData)) return { ok: true };

  if (!nome || !email || !consentimento) {
    return { ok: false, erro: t("financingRequired") };
  }

  const supabase = createAdminClient();

  const { data: lead, error: erroLead } = await supabase
    .from("leads")
    .insert({
      origem: "formulario_site",
      nome,
      telefone: telefone || null,
      email,
      imovel_id: imovelId || null,
      mensagem: "Pedido de pré-análise de financiamento",
    })
    .select("id")
    .single();

  if (erroLead) {
    return { ok: false, erro: t("sendFailed") };
  }

  const { error: erroSimulacao } = await supabase.from("simulacoes_financiamento").insert({
    lead_id: lead.id,
    imovel_id: imovelId || null,
    valor_imovel: valorImovel,
    entrada,
    taxa_tan: taxaTan,
    prazo_anos: prazoAnos,
    rendimento_liquido: rendimentoLiquido,
    prestacao_mensal: prestacaoMensal,
    montante_financiado: montanteFinanciado,
    ltv,
    taxa_esforco: taxaEsforco,
  });

  if (erroSimulacao) {
    return { ok: false, erro: t("sendFailed") };
  }

  return { ok: true };
}
