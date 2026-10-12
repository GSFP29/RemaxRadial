import { createClient } from "@/lib/supabase/server";

// Só concelhos onde já temos imóveis à venda — nunca oferecer uma opção
// sem hipótese de dar uma estimativa (mesmo padrão de obterOpcoesFiltro).
export async function listarConcelhosComImoveis(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("imoveis")
    .select("concelho")
    .eq("estado", "ativo")
    .eq("tipo", "venda")
    .not("concelho", "is", null)
    .not("preco_pedido", "is", null)
    .not("area_m2", "is", null);

  const concelhos = [...new Set((data ?? []).map((d) => d.concelho as string))];
  return concelhos.sort((a, b) => a.localeCompare(b, "pt"));
}
