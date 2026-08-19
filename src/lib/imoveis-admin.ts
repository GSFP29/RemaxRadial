import { createClient } from "@/lib/supabase/server";
import type { AlteracaoImovel, ImovelDashboard } from "@/lib/dashboard-formato";

const CAMPOS_DASHBOARD =
  "id, ref_remax, tipo, tipo_imovel, estado, preco_pedido, freguesia, concelho, data_angariacao, criado_em, dados_api";

// Só o que está no mercado agora — fechados/desaparecidos ficam de fora
// da tabela principal para o dashboard se manter sucinto. As contagens
// de referência (ver docs/benchmarks.md) já cobrem o histórico todo.
export async function listarImoveisParaDashboard(): Promise<ImovelDashboard[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("imoveis")
    .select(CAMPOS_DASHBOARD)
    .in("estado", ["ativo", "reservado"])
    .order("criado_em", { ascending: false });

  return (data ?? []) as unknown as ImovelDashboard[];
}

// Carteira pequena (dezenas de imóveis) — mais simples trazer tudo de
// uma vez do que paginar por imóvel quando o modal abre.
export async function listarAlteracoesPorImovel(): Promise<
  Record<string, AlteracaoImovel[]>
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("imoveis_alteracoes")
    .select("id, imovel_id, campo, valor_anterior, valor_novo, criado_em")
    .order("criado_em", { ascending: false });

  const porImovel: Record<string, AlteracaoImovel[]> = {};
  for (const alteracao of data ?? []) {
    const lista = porImovel[alteracao.imovel_id] ?? [];
    lista.push(alteracao);
    porImovel[alteracao.imovel_id] = lista;
  }
  return porImovel;
}
