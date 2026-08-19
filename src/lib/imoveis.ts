import { createClient } from "@/lib/supabase/server";

// Ver docs/api-remax.md, secção "Imagens" — CDN confirmado por inspeção,
// não documentado pela RE/MAX.
export function imagemUrl(caminho: string, tamanho: "l-feat" | "ds-l" = "l-feat") {
  return `https://i.maxwork.pt/${tamanho}/${caminho}`;
}

export type ImovelPublico = {
  id: string;
  ref_remax: string;
  tipo: "venda" | "arrendamento";
  tipo_imovel: string | null;
  preco_pedido: number | null;
  morada: string | null;
  freguesia: string | null;
  concelho: string | null;
  tipologia: string | null;
  area_m2: number | null;
  ano_construcao: number | null;
  quartos: number | null;
  casas_banho: number | null;
  certificado_energetico: string | null;
  dados_api: {
    listingPictures?: string[];
    userName?: string;
    userCellPhone?: string;
  } | null;
};

const CAMPOS_PUBLICOS =
  "id, ref_remax, tipo, tipo_imovel, preco_pedido, morada, freguesia, concelho, tipologia, area_m2, ano_construcao, quartos, casas_banho, certificado_energetico, dados_api";

export async function listarImoveisAtivos(): Promise<ImovelPublico[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("imoveis")
    .select(CAMPOS_PUBLICOS)
    .eq("estado", "ativo")
    .order("criado_em", { ascending: false });

  return (data ?? []) as unknown as ImovelPublico[];
}

export async function obterImovelPorRef(
  ref: string,
): Promise<ImovelPublico | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("imoveis")
    .select(CAMPOS_PUBLICOS)
    .eq("estado", "ativo")
    .eq("ref_remax", ref)
    .maybeSingle();

  return data as unknown as ImovelPublico | null;
}

export function formatarPreco(valor: number | null): string {
  if (valor === null) return "Sob consulta";
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(valor);
}
