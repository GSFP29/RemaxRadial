// Tipos e funções puras sobre imóveis — sem acesso à base de dados, por
// isso podem ser importadas por Client Components (ao contrário de
// lib/imoveis.ts, que usa o cliente Supabase de servidor).

export type TipoNegocio = "venda" | "arrendamento";

export type ImovelPublico = {
  id: string;
  ref_remax: string;
  tipo: TipoNegocio;
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
  latitude: number | null;
  longitude: number | null;
  dados_api: {
    listingPictures?: string[];
    userName?: string;
    userCellPhone?: string;
    regionSearch2?: string;
    regionSearch3?: string;
  } | null;
};

// Ver docs/api-remax.md, secção "Imagens" — CDN confirmado por inspeção,
// não documentado pela RE/MAX.
export function imagemUrl(
  caminho: string,
  tamanho: "l-feat" | "ds-l" = "l-feat",
) {
  return `https://i.maxwork.pt/${tamanho}/${caminho}`;
}

// Ver docs/api-remax.md, secção "URLs dos anúncios" — o portal resolve
// pela referência, o slug é só cosmético, mas vale a pena gerá-lo bem.
export function urlAnuncioRemax(imovel: ImovelPublico): string {
  const tipologiaSlug = imovel.tipologia
    ? imovel.tipologia.toLowerCase()
    : "imovel";
  const tipoImovelSlug = imovel.tipo_imovel ?? "imovel";
  const zona2 = imovel.dados_api?.regionSearch2 ?? "portugal";
  const zona3 = imovel.dados_api?.regionSearch3 ?? "";
  const slug = [imovel.tipo, tipoImovelSlug, tipologiaSlug, zona2, zona3]
    .filter(Boolean)
    .join("-");

  return `https://www.remax.pt/pt/imoveis/${slug}/${imovel.ref_remax}`;
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
