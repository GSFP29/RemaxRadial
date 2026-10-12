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
    userEmail?: string | null;
    regionSearch2?: string;
    regionSearch3?: string;
    parking?: boolean;
    garage?: boolean;
    elevator?: boolean;
    electricCarsCharging?: boolean;
    hasVTour?: boolean;
    vTourLink?: string;
  } | null;
};

// Comodidades a mostrar como checklist na ficha do imóvel — só as que
// a API confirma como verdadeiras, nunca listar o que não sabemos.
export function comodidadesImovel(imovel: ImovelPublico): string[] {
  const d = imovel.dados_api;
  if (!d) return [];
  const lista: string[] = [];
  if (d.parking) lista.push("Estacionamento");
  if (d.garage) lista.push("Garagem");
  if (d.elevator) lista.push("Elevador");
  if (d.electricCarsCharging) lista.push("Carregamento para carro elétrico");
  return lista;
}

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

// Título curto e legível do imóvel, usado no ecrã e nas mensagens de
// contacto (WhatsApp) — não vem da API, é composto a partir dos campos
// que já temos.
export function tituloImovel(imovel: ImovelPublico): string {
  return (
    [imovel.tipo_imovel, imovel.tipologia].filter(Boolean).join(" ") +
    (imovel.freguesia ? ` em ${imovel.freguesia}` : "")
  ).trim();
}

export function mensagemWhatsappImovel(imovel: ImovelPublico): string {
  const titulo = tituloImovel(imovel) || `imóvel ${imovel.ref_remax}`;
  return `Olá! Estou interessado(a) no imóvel ${titulo} que vi no vosso site. Ainda está disponível? Gostaria de saber mais. Obrigado(a)!`;
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
