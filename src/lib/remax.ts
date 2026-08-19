// API pública do portal RE/MAX — ver docs/api-remax.md para as armadilhas.
// Só chamar a partir de um servidor: bloqueada por CORS a partir do browser.

const ENDPOINT =
  "https://www.remax.pt/api/Listing/PaginatedMultiMatchSearch";

const OFFICE_NUMBER = "12116"; // RE/MAX Radial, Odivelas
const PAGE_SIZE = 200;

// Payload conforme devolvido pela API. Só os campos que usamos —
// o resto fica guardado em bruto em `dados_api`.
export type RemaxListing = {
  listingTitle: string;
  listingStatusID: number;
  businessTypeID: number;
  listingPrice: number | null;
  address: string | null;
  publicAddress: boolean | null; // indica se `address` pode ser mostrada, não é a morada
  regionName2: string | null; // concelho
  regionName3: string | null; // freguesia
  latitude: number | null;
  longitude: number | null;
  livingArea: number | null;
  totalArea: number | null;
  numberOfBedrooms: number | null;
  numberOfWC: number | null;
  numberOfBathrooms: number | null;
  energeticSpecification: string | null;
  contractDate: string | null;
  constructionYear: string | number | null;
  descriptionTags: string | null;
  [key: string]: unknown;
};

type SearchResponse = {
  data?: RemaxListing[];
  items?: RemaxListing[];
  results?: RemaxListing[];
  totalCount?: number;
};

export async function fetchCarteiraRemax(): Promise<RemaxListing[]> {
  const listagens: RemaxListing[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page,
        pageSize: PAGE_SIZE,
        filters: [
          {
            field: "officeNumber",
            operationType: "int",
            operator: "=",
            value: OFFICE_NUMBER,
          },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(
        `API RE/MAX devolveu ${res.status} na página ${page}: ${await res.text()}`,
      );
    }

    const json: SearchResponse | RemaxListing[] = await res.json();
    const pagina = Array.isArray(json)
      ? json
      : (json.data ?? json.items ?? json.results ?? []);

    listagens.push(...pagina);

    if (pagina.length < PAGE_SIZE) break;
    page += 1;
  }

  return listagens;
}

const ESTADO_POR_STATUS_ID: Record<number, string> = {
  1: "ativo",
  2: "reservado",
  4: "vendido",
  6: "arrendado",
};

export type ImovelRow = {
  ref_remax: string;
  agent_id: string;
  consultor_id: string | null;
  tipo: "venda" | "arrendamento";
  tipo_imovel: string | null;
  estado: string;
  preco_pedido: number | null;
  morada: string | null;
  freguesia: string | null;
  concelho: string | null;
  latitude: number | null;
  longitude: number | null;
  tipologia: string | null;
  area_m2: number | null;
  ano_construcao: number | null;
  quartos: number | null;
  casas_banho: number | null;
  certificado_energetico: string | null;
  data_angariacao: string | null;
  dados_api: RemaxListing;
  visto_em: string;
};

// A API não documenta este campo, mas descriptionTags segue sempre
// "{venda|arrendamento}-{tipo}-{tipologia}-{concelho}-{freguesia}" — dá-nos
// o tipo de imóvel (apartamento, moradia, loja, terreno, armazém...) sem
// precisarmos de um mapa de IDs que a RE/MAX também não documenta.
function extrairTipoImovel(descriptionTags: string | null): string | null {
  if (!descriptionTags) return null;
  return descriptionTags.split("-")[1] ?? null;
}

// constructionYear vem sujo nalguns registos (ex. "803" num imóvel de
// Lisboa) — só aceitar valores plausíveis em vez de confiar cegamente.
const ANO_MINIMO = 1800;

function extrairAnoConstrucao(
  constructionYear: string | number | null,
): number | null {
  const ano = Number(constructionYear);
  const anoMaximo = new Date().getFullYear() + 2;
  if (!Number.isFinite(ano) || ano < ANO_MINIMO || ano > anoMaximo) {
    return null;
  }
  return ano;
}

export function mapListingParaImovel(
  listing: RemaxListing,
  consultorIdPorAgentId: Map<string, string>,
): ImovelRow {
  const agentId = listing.listingTitle.split("-")[0];
  const quartos = listing.numberOfBedrooms ?? null;

  return {
    ref_remax: listing.listingTitle,
    agent_id: agentId,
    consultor_id: consultorIdPorAgentId.get(agentId) ?? null,
    tipo: listing.businessTypeID === 2 ? "arrendamento" : "venda",
    tipo_imovel: extrairTipoImovel(listing.descriptionTags),
    estado: ESTADO_POR_STATUS_ID[listing.listingStatusID] ?? "desconhecido",
    preco_pedido: listing.listingPrice ?? null,
    morada: listing.publicAddress === true ? (listing.address ?? null) : null,
    freguesia: listing.regionName3 ?? null,
    concelho: listing.regionName2 ?? null,
    latitude: listing.latitude ?? null,
    longitude: listing.longitude ?? null,
    tipologia: quartos !== null ? `T${quartos}` : null,
    area_m2: listing.livingArea ?? listing.totalArea ?? null,
    ano_construcao: extrairAnoConstrucao(listing.constructionYear),
    quartos,
    // numberOfBathrooms é o campo fiável; numberOfWC costuma vir "0" mesmo
    // quando há casas de banho reais — nunca usar como prioridade sobre ele.
    casas_banho: listing.numberOfBathrooms ?? listing.numberOfWC ?? null,
    certificado_energetico: listing.energeticSpecification ?? null,
    data_angariacao: listing.contractDate ?? null,
    dados_api: listing,
    visto_em: new Date().toISOString(),
  };
}
