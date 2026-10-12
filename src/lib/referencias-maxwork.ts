import { createClient } from "@/lib/supabase/server";

// Referência de mercado agregada a partir de vendas reais na rede RE/MAX
// (MAXWORK), importada periodicamente por scripts/importar-maxwork-vendidos.mjs
// — ver supabase/migrations/0018_referencias_maxwork.sql.

export type ReferenciaMaxwork = {
  amostraN: number;
  precoM2Mediano: number;
  precoM2P10: number;
  precoM2P90: number;
  medianaDiasMercado: number | null;
  periodoMeses: number;
  atualizadoEm: string;
};

type LinhaReferencia = {
  amostra_n: number;
  preco_m2_p10: number;
  preco_m2_p50: number;
  preco_m2_p90: number;
  mediana_dias_mercado: number | null;
  periodo_meses: number;
  atualizado_em: string;
};

function paraReferencia(linha: LinhaReferencia): ReferenciaMaxwork {
  return {
    amostraN: linha.amostra_n,
    precoM2Mediano: linha.preco_m2_p50,
    precoM2P10: linha.preco_m2_p10,
    precoM2P90: linha.preco_m2_p90,
    medianaDiasMercado: linha.mediana_dias_mercado,
    periodoMeses: linha.periodo_meses,
    atualizadoEm: linha.atualizado_em,
  };
}

// Tenta concelho+tipologia; se não existir (amostra curta a mais para ter
// entrado na importação), cai para o concelho inteiro — mesmo padrão de
// fallback usado no resto do simulador.
export async function obterReferenciaMaxwork(
  concelho: string,
  tipologia: string,
): Promise<ReferenciaMaxwork | null> {
  const supabase = await createClient();

  const { data: exata } = await supabase
    .from("referencias_maxwork")
    .select("amostra_n, preco_m2_p10, preco_m2_p50, preco_m2_p90, mediana_dias_mercado, periodo_meses, atualizado_em")
    .eq("concelho", concelho)
    .eq("tipologia", tipologia)
    .maybeSingle();

  if (exata) return paraReferencia(exata);

  const { data: doConcelho } = await supabase
    .from("referencias_maxwork")
    .select("amostra_n, preco_m2_p10, preco_m2_p50, preco_m2_p90, mediana_dias_mercado, periodo_meses, atualizado_em")
    .eq("concelho", concelho)
    .eq("tipologia", "")
    .maybeSingle();

  return doConcelho ? paraReferencia(doConcelho) : null;
}
