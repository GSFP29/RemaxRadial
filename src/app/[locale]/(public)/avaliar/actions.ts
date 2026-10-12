"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AMOSTRA_MINIMA, percentil } from "@/lib/avaliacao-formato";
import { obterReferenciaIne, type ReferenciaIne } from "@/lib/ine";
import { obterReferenciaMaxwork, type ReferenciaMaxwork } from "@/lib/referencias-maxwork";

export type EstimativaResultado = {
  ok: boolean;
  erro?: string;
  amostraN?: number;
  precoM2Mediano?: number;
  estimativaMin?: number;
  estimativaMax?: number;
  // Espectro de mercado — 5 pontos (p10/p25/p50/p75/p90 em €, para esta
  // área) que desenham 4 bandas: subvalorizado / abaixo da média / acima
  // da média / sobrevalorizado. Vem só da distribuição real dos
  // comparáveis (quartis) — sem dados externos nem input do utilizador.
  espectroP10?: number;
  espectroP25?: number;
  espectroP50?: number;
  espectroP75?: number;
  espectroP90?: number;
  // Referência oficial INE (avaliação bancária) — vem sempre que o
  // concelho está mapeado, mesmo sem amostra própria suficiente.
  referenciaIne?: ReferenciaIne | null;
  // Referência de vendas reais na rede RE/MAX (MAXWORK) — mesma lógica de
  // fallback concelho+tipologia → concelho inteiro.
  referenciaMaxwork?: ReferenciaMaxwork | null;
  concelho?: string;
  freguesia?: string;
  tipologia?: string;
  areaM2?: number;
};

type LinhaComparavel = { preco_pedido: number | null; area_m2: number | null };

function precosM2(linhas: LinhaComparavel[]): number[] {
  return linhas
    .filter((l): l is { preco_pedido: number; area_m2: number } => !!l.preco_pedido && !!l.area_m2)
    .map((l) => l.preco_pedido / l.area_m2)
    .filter((n) => Number.isFinite(n) && n > 0);
}

export async function calcularEstimativa(
  _estadoAnterior: EstimativaResultado | null,
  formData: FormData,
): Promise<EstimativaResultado> {
  const concelho = String(formData.get("concelho") ?? "").trim();
  const freguesia = String(formData.get("freguesia") ?? "").trim();
  const tipologia = String(formData.get("tipologia") ?? "").trim();
  const areaM2 = Number(formData.get("areaM2"));

  if (!concelho || !tipologia || !areaM2 || areaM2 <= 0) {
    return { ok: false, erro: "Preenche o concelho, a tipologia e a área." };
  }

  const supabase = await createClient();

  // Nenhuma das referências externas depende da nossa amostra — pedimos
  // já, para saírem sempre mesmo que a amostra própria seja curta.
  const referenciaIne = await obterReferenciaIne(concelho);
  const referenciaMaxwork = await obterReferenciaMaxwork(concelho, tipologia);

  // 1ª tentativa: concelho + tipologia iguais.
  const { data: exato } = await supabase
    .from("imoveis")
    .select("preco_pedido, area_m2")
    .eq("estado", "ativo")
    .eq("tipo", "venda")
    .eq("concelho", concelho)
    .eq("tipologia", tipologia);

  let amostra = precosM2(exato ?? []);

  // Amostra pequena → alarga a qualquer tipologia no mesmo concelho, para
  // dar melhor ideia do preço/m² da zona (ainda melhor que nada).
  if (amostra.length < AMOSTRA_MINIMA) {
    const { data: alargado } = await supabase
      .from("imoveis")
      .select("preco_pedido, area_m2")
      .eq("estado", "ativo")
      .eq("tipo", "venda")
      .eq("concelho", concelho);

    const amostraAlargada = precosM2(alargado ?? []);
    if (amostraAlargada.length > amostra.length) amostra = amostraAlargada;
  }

  if (amostra.length < AMOSTRA_MINIMA) {
    return {
      ok: true,
      amostraN: amostra.length,
      referenciaIne,
      referenciaMaxwork,
      concelho,
      freguesia,
      tipologia,
      areaM2,
    };
  }

  const precoM2Mediano = percentil(amostra, 50);

  return {
    ok: true,
    amostraN: amostra.length,
    precoM2Mediano,
    estimativaMin: Math.round(precoM2Mediano * 0.88 * areaM2),
    estimativaMax: Math.round(precoM2Mediano * 1.12 * areaM2),
    espectroP10: Math.round(percentil(amostra, 10) * areaM2),
    espectroP25: Math.round(percentil(amostra, 25) * areaM2),
    espectroP50: Math.round(precoM2Mediano * areaM2),
    espectroP75: Math.round(percentil(amostra, 75) * areaM2),
    espectroP90: Math.round(percentil(amostra, 90) * areaM2),
    referenciaIne,
    referenciaMaxwork,
    concelho,
    freguesia,
    tipologia,
    areaM2,
  };
}

export type EstadoPedidoAvaliacao = { ok: boolean; erro?: string };

export async function enviarPedidoAvaliacao(
  _estadoAnterior: EstadoPedidoAvaliacao | null,
  formData: FormData,
): Promise<EstadoPedidoAvaliacao> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const concelho = String(formData.get("concelho") ?? "").trim();
  const freguesia = String(formData.get("freguesia") ?? "").trim();
  const tipologia = String(formData.get("tipologia") ?? "").trim();
  const areaM2 = Number(formData.get("areaM2"));
  const amostraN = Number(formData.get("amostraN")) || 0;
  const precoM2Mediano = Number(formData.get("precoM2Mediano")) || null;
  const estimativaMin = Number(formData.get("estimativaMin")) || null;
  const estimativaMax = Number(formData.get("estimativaMax")) || null;

  if (!nome || !email) {
    return { ok: false, erro: "Preenche o nome e o email." };
  }

  const supabase = createAdminClient();

  const resumo =
    estimativaMin && estimativaMax
      ? `Estimativa ${estimativaMin}–${estimativaMax}€`
      : "Sem estimativa (amostra insuficiente)";

  const { data: lead, error: erroLead } = await supabase
    .from("leads")
    .insert({
      origem: "formulario_site",
      nome,
      telefone: telefone || null,
      email,
      mensagem: `Pedido de avaliação — ${tipologia}, ${areaM2}m², ${[freguesia, concelho].filter(Boolean).join(", ")} — ${resumo}`,
    })
    .select("id")
    .single();

  if (erroLead) {
    return { ok: false, erro: "Não foi possível enviar o pedido. Tenta novamente." };
  }

  const { error: erroSimulacao } = await supabase.from("simulacoes_avaliacao").insert({
    lead_id: lead.id,
    concelho,
    freguesia: freguesia || null,
    tipologia,
    area_m2: areaM2,
    amostra_n: amostraN,
    preco_m2_estimado: precoM2Mediano,
    estimativa_min: estimativaMin,
    estimativa_max: estimativaMax,
  });

  if (erroSimulacao) {
    return { ok: false, erro: "Não foi possível enviar o pedido. Tenta novamente." };
  }

  return { ok: true };
}
