import { createClient } from "@/lib/supabase/server";
import type { ImovelPublico, TipoNegocio } from "@/lib/imoveis-formato";

export type { ImovelPublico, TipoNegocio } from "@/lib/imoveis-formato";
export { imagemUrl, formatarPreco, urlAnuncioRemax } from "@/lib/imoveis-formato";

const CAMPOS_PUBLICOS =
  "id, ref_remax, tipo, tipo_imovel, preco_pedido, morada, freguesia, concelho, tipologia, area_m2, ano_construcao, quartos, casas_banho, certificado_energetico, latitude, longitude, dados_api";

export type FiltrosImoveis = {
  tipologia?: string;
  freguesia?: string;
  consultor?: string;
};

export async function listarImoveisPorTipo(
  tipo: TipoNegocio,
  filtros: FiltrosImoveis = {},
): Promise<ImovelPublico[]> {
  const supabase = await createClient();
  let query = supabase
    .from("imoveis")
    .select(CAMPOS_PUBLICOS)
    .eq("estado", "ativo")
    .eq("tipo", tipo);

  if (filtros.tipologia) query = query.eq("tipologia", filtros.tipologia);
  if (filtros.freguesia) query = query.eq("freguesia", filtros.freguesia);
  if (filtros.consultor) {
    query = query.eq("dados_api->>userName", filtros.consultor);
  }

  const { data } = await query.order("criado_em", { ascending: false });

  return (data ?? []) as unknown as ImovelPublico[];
}

// Opções para os filtros — calculadas a partir dos imóveis realmente
// disponíveis desse tipo, para nunca oferecer uma opção sem resultados.
export async function obterOpcoesFiltro(tipo: TipoNegocio) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("imoveis")
    .select("tipologia, freguesia, dados_api")
    .eq("estado", "ativo")
    .eq("tipo", tipo);

  const linhas = (data ?? []) as unknown as Pick<
    ImovelPublico,
    "tipologia" | "freguesia" | "dados_api"
  >[];

  const tipologias = [
    ...new Set(linhas.map((l) => l.tipologia).filter((v): v is string => !!v)),
  ].sort((a, b) => parseInt(a.replace("T", ""), 10) - parseInt(b.replace("T", ""), 10));

  const freguesias = [
    ...new Set(linhas.map((l) => l.freguesia).filter((v): v is string => !!v)),
  ].sort((a, b) => a.localeCompare(b, "pt"));

  const consultores = [
    ...new Set(
      linhas.map((l) => l.dados_api?.userName).filter((v): v is string => !!v),
    ),
  ].sort((a, b) => a.localeCompare(b, "pt"));

  return { tipologias, freguesias, consultores };
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
