// Referência oficial de preços de mercado — INE, Inquérito à Avaliação
// Bancária na Habitação (indicadores 0012248 e 0012250, api pública e
// gratuita em ine.pt). Não é scraping: é a fonte que o próprio INE
// disponibiliza para reutilização, atualizada por eles uma vez por mês —
// aqui só fazemos cache de 24h em cima disso.
//
// 0012248 dá o valor mediano de avaliação bancária (€/m²) por concelho.
// 0012250 dá a variação homóloga (%) mas só existe ao nível de NUTS II
// (11 regiões) — não há série por concelho. Os dois primeiros carateres do
// geocod de um concelho são sempre o código da sua NUTS II (ex.: Odivelas
// "1A01116" → "1A" = Grande Lisboa), por isso usamos o mesmo mapa para as
// duas consultas.

// Geografia administrativa (Município - 2024). Não muda com frequência —
// gerado a partir da metainformação do próprio INE, cruzado com os
// concelhos usados em distritos-concelhos.ts. Faltam só 4 dos 308 (Calheta
// Madeira/Açores, Lagoa Açores, Praia da Vitória) por ambiguidade de nome
// na base do INE — nesses casos obterReferenciaIne devolve null e a UI
// esconde o bloco, como em qualquer outra fonte de dados opcional da app.
export const GEOCOD_POR_CONCELHO: Record<string, string> = {
  "Águeda": "1910101",
  "Albergaria-a-Velha": "1910102",
  "Anadia": "1910103",
  "Arouca": "11A0104",
  "Aveiro": "1910105",
  "Castelo de Paiva": "11C0106",
  "Espinho": "11A0107",
  "Estarreja": "1910108",
  "Ílhavo": "1910110",
  "Mealhada": "1920111",
  "Murtosa": "1910112",
  "Oliveira de Azeméis": "11A0113",
  "Oliveira do Bairro": "1910114",
  "Ovar": "1910115",
  "Santa Maria da Feira": "11A0109",
  "São João da Madeira": "11A0116",
  "Sever do Vouga": "1910117",
  "Vagos": "1910118",
  "Vale de Cambra": "11A0119",
  "Aljustrel": "1C20201",
  "Almodôvar": "1C20202",
  "Alvito": "1C20203",
  "Barrancos": "1C20204",
  "Beja": "1C20205",
  "Castro Verde": "1C20206",
  "Cuba": "1C20207",
  "Ferreira do Alentejo": "1C20208",
  "Mértola": "1C20209",
  "Moura": "1C20210",
  "Odemira": "1C10211",
  "Ourique": "1C20212",
  "Serpa": "1C20213",
  "Vidigueira": "1C20214",
  "Amares": "1120301",
  "Barcelos": "1120302",
  "Braga": "1120303",
  "Cabeceiras de Basto": "1190304",
  "Celorico de Basto": "11C0305",
  "Esposende": "1120306",
  "Fafe": "1190307",
  "Guimarães": "1190308",
  "Póvoa de Lanhoso": "1190309",
  "Terras de Bouro": "1120310",
  "Vieira do Minho": "1190311",
  "Vila Nova de Famalicão": "1190312",
  "Vila Verde": "1120313",
  "Vizela": "1190314",
  "Alfândega da Fé": "11E0401",
  "Bragança": "11E0402",
  "Carrazeda de Ansiães": "11D0403",
  "Freixo de Espada à Cinta": "11D0404",
  "Macedo de Cavaleiros": "11E0405",
  "Miranda do Douro": "11E0406",
  "Mirandela": "11E0407",
  "Mogadouro": "11E0408",
  "Torre de Moncorvo": "11D0409",
  "Vila Flor": "11E0410",
  "Vimioso": "11E0411",
  "Vinhais": "11E0412",
  "Belmonte": "1960501",
  "Castelo Branco": "1950502",
  "Covilhã": "1960503",
  "Fundão": "1960504",
  "Idanha-a-Nova": "1950505",
  "Oleiros": "1950506",
  "Penamacor": "1950507",
  "Proença-a-Nova": "1950508",
  "Sertã": "1950509",
  "Vila de Rei": "1950510",
  "Vila Velha de Ródão": "1950511",
  "Arganil": "1920601",
  "Cantanhede": "1920602",
  "Coimbra": "1920603",
  "Condeixa-a-Nova": "1920604",
  "Figueira da Foz": "1920605",
  "Góis": "1920606",
  "Lousã": "1920607",
  "Mira": "1920608",
  "Miranda do Corvo": "1920609",
  "Montemor-o-Velho": "1920610",
  "Oliveira do Hospital": "1920611",
  "Pampilhosa da Serra": "1920612",
  "Penacova": "1920613",
  "Penela": "1920614",
  "Soure": "1920615",
  "Tábua": "1920616",
  "Vila Nova de Poiares": "1920617",
  "Alandroal": "1C40701",
  "Arraiolos": "1C40702",
  "Borba": "1C40703",
  "Estremoz": "1C40704",
  "Évora": "1C40705",
  "Montemor-o-Novo": "1C40706",
  "Mora": "1C40707",
  "Mourão": "1C40708",
  "Portel": "1C40709",
  "Redondo": "1C40710",
  "Reguengos de Monsaraz": "1C40711",
  "Vendas Novas": "1C40712",
  "Viana do Alentejo": "1C40713",
  "Vila Viçosa": "1C40714",
  "Albufeira": "1500801",
  "Alcoutim": "1500802",
  "Aljezur": "1500803",
  "Castro Marim": "1500804",
  "Faro": "1500805",
  "Lagoa": "1500806",
  "Lagos": "1500807",
  "Loulé": "1500808",
  "Monchique": "1500809",
  "Olhão": "1500810",
  "Portimão": "1500811",
  "São Brás de Alportel": "1500812",
  "Silves": "1500813",
  "Tavira": "1500814",
  "Vila do Bispo": "1500815",
  "Vila Real de Santo António": "1500816",
  "Aguiar da Beira": "1940901",
  "Almeida": "1960902",
  "Celorico da Beira": "1960903",
  "Figueira de Castelo Rodrigo": "1960904",
  "Fornos de Algodres": "1960905",
  "Gouveia": "1960906",
  "Guarda": "1960907",
  "Manteigas": "1960908",
  "Mêda": "1960909",
  "Pinhel": "1960910",
  "Sabugal": "1960911",
  "Seia": "1960912",
  "Trancoso": "1960913",
  "Vila Nova de Foz Côa": "11D0914",
  "Alcobaça": "1D11001",
  "Alvaiázere": "1931002",
  "Ansião": "1931003",
  "Batalha": "1931004",
  "Bombarral": "1D11005",
  "Caldas da Rainha": "1D11006",
  "Castanheira de Pêra": "1931007",
  "Figueiró dos Vinhos": "1931008",
  "Leiria": "1931009",
  "Marinha Grande": "1931010",
  "Nazaré": "1D11011",
  "Óbidos": "1D11012",
  "Pedrógão Grande": "1931013",
  "Peniche": "1D11014",
  "Pombal": "1931015",
  "Porto de Mós": "1931016",
  "Alenquer": "1D11101",
  "Amadora": "1A01115",
  "Arruda dos Vinhos": "1D11102",
  "Azambuja": "1D31103",
  "Cadaval": "1D11104",
  "Cascais": "1A01105",
  "Lisboa": "1A01106",
  "Loures": "1A01107",
  "Lourinhã": "1D11108",
  "Mafra": "1A01109",
  "Odivelas": "1A01116",
  "Oeiras": "1A01110",
  "Sintra": "1A01111",
  "Sobral de Monte Agraço": "1D11112",
  "Torres Vedras": "1D11113",
  "Vila Franca de Xira": "1A01114",
  "Alter do Chão": "1C31201",
  "Arronches": "1C31202",
  "Avis": "1C31203",
  "Campo Maior": "1C31204",
  "Castelo de Vide": "1C31205",
  "Crato": "1C31206",
  "Elvas": "1C31207",
  "Fronteira": "1C31208",
  "Gavião": "1C31209",
  "Marvão": "1C31210",
  "Monforte": "1C31211",
  "Nisa": "1C31212",
  "Ponte de Sor": "1C31213",
  "Portalegre": "1C31214",
  "Sousel": "1C31215",
  "Amarante": "11C1301",
  "Baião": "11C1302",
  "Felgueiras": "11C1303",
  "Gondomar": "11A1304",
  "Lousada": "11C1305",
  "Maia": "11A1306",
  "Marco de Canaveses": "11C1307",
  "Matosinhos": "11A1308",
  "Paços de Ferreira": "11C1309",
  "Paredes": "11A1310",
  "Penafiel": "11C1311",
  "Porto": "11A1312",
  "Póvoa de Varzim": "11A1313",
  "Santo Tirso": "11A1314",
  "Trofa": "11A1318",
  "Valongo": "11A1315",
  "Vila do Conde": "11A1316",
  "Vila Nova de Gaia": "11A1317",
  "Abrantes": "1D21401",
  "Alcanena": "1D21402",
  "Almeirim": "1D31403",
  "Alpiarça": "1D31404",
  "Benavente": "1D31405",
  "Cartaxo": "1D31406",
  "Chamusca": "1D31407",
  "Constância": "1D21408",
  "Coruche": "1D31409",
  "Entroncamento": "1D21410",
  "Ferreira do Zêzere": "1D21411",
  "Golegã": "1D31412",
  "Mação": "1D21413",
  "Ourém": "1D21421",
  "Rio Maior": "1D31414",
  "Salvaterra de Magos": "1D31415",
  "Santarém": "1D31416",
  "Sardoal": "1D21417",
  "Tomar": "1D21418",
  "Torres Novas": "1D21419",
  "Vila Nova da Barquinha": "1D21420",
  "Alcácer do Sal": "1C11501",
  "Alcochete": "1B01502",
  "Almada": "1B01503",
  "Barreiro": "1B01504",
  "Grândola": "1C11505",
  "Moita": "1B01506",
  "Montijo": "1B01507",
  "Palmela": "1B01508",
  "Santiago do Cacém": "1C11509",
  "Seixal": "1B01510",
  "Sesimbra": "1B01511",
  "Setúbal": "1B01512",
  "Sines": "1C11513",
  "Arcos de Valdevez": "1111601",
  "Caminha": "1111602",
  "Melgaço": "1111603",
  "Monção": "1111604",
  "Paredes de Coura": "1111605",
  "Ponte da Barca": "1111606",
  "Ponte de Lima": "1111607",
  "Valença": "1111608",
  "Viana do Castelo": "1111609",
  "Vila Nova de Cerveira": "1111610",
  "Alijó": "11D1701",
  "Boticas": "11B1702",
  "Chaves": "11B1703",
  "Mesão Frio": "11D1704",
  "Mondim de Basto": "1191705",
  "Montalegre": "11B1706",
  "Murça": "11D1707",
  "Peso da Régua": "11D1708",
  "Ribeira de Pena": "11B1709",
  "Sabrosa": "11D1710",
  "Santa Marta de Penaguião": "11D1711",
  "Valpaços": "11B1712",
  "Vila Pouca de Aguiar": "11B1713",
  "Vila Real": "11D1714",
  "Armamar": "11D1801",
  "Carregal do Sal": "1941802",
  "Castro Daire": "1941803",
  "Cinfães": "11C1804",
  "Lamego": "11D1805",
  "Mangualde": "1941806",
  "Moimenta da Beira": "11D1807",
  "Mortágua": "1921808",
  "Nelas": "1941809",
  "Oliveira de Frades": "1941810",
  "Penalva do Castelo": "1941811",
  "Penedono": "11D1812",
  "Resende": "11C1813",
  "Santa Comba Dão": "1941814",
  "São João da Pesqueira": "11D1815",
  "São Pedro do Sul": "1941816",
  "Sátão": "1941817",
  "Sernancelhe": "11D1818",
  "Tabuaço": "11D1819",
  "Tarouca": "11D1820",
  "Tondela": "1941821",
  "Vila Nova de Paiva": "1941822",
  "Viseu": "1941823",
  "Vouzela": "1941824",
  "Câmara de Lobos": "3003102",
  "Funchal": "3003103",
  "Machico": "3003104",
  "Ponta do Sol": "3003105",
  "Porto Moniz": "3003106",
  "Porto Santo": "3003201",
  "Ribeira Brava": "3003107",
  "Santa Cruz": "3003108",
  "Santana": "3003109",
  "São Vicente": "3003110",
  "Angra do Heroísmo": "2004301",
  "Corvo": "2004901",
  "Horta": "2004701",
  "Lajes das Flores": "2004801",
  "Lajes do Pico": "2004601",
  "Madalena": "2004602",
  "Nordeste": "2004202",
  "Ponta Delgada": "2004203",
  "Povoação": "2004204",
  "Ribeira Grande": "2004205",
  "Santa Cruz da Graciosa": "2004401",
  "Santa Cruz das Flores": "2004802",
  "São Roque do Pico": "2004603",
  "Velas": "2004502",
  "Vila do Porto": "2004101",
  "Vila Franca do Campo": "2004206",
};

export type ReferenciaIne = {
  valorM2: number;
  periodo: string;
  variacaoHomologa: number | null;
  regiao: string;
};

const INDICADOR_VALOR_M2 = "0012248";
const INDICADOR_VARIACAO_HOMOLOGA = "0012250";

async function pedirIndicador(
  varcd: string,
  dim2: string,
): Promise<{ periodo: string; valor: number; regiao: string } | null> {
  const url = `https://www.ine.pt/ine/json_indicador/pindica.jsp?op=2&varcd=${varcd}&Dim2=${dim2}&Dim3=T&lang=PT`;

  try {
    // O portal do INE é por vezes lento ou fica indisponível — nunca deve
    // atrasar o simulador. 5s de limite, falha silenciosa a seguir disso.
    const resposta = await fetch(url, {
      next: { revalidate: 60 * 60 * 24 },
      signal: AbortSignal.timeout(5000),
    });
    if (!resposta.ok) return null;

    const corpo = (await resposta.json()) as Array<{ Dados?: Record<string, unknown> }>;
    const dados = corpo[0]?.Dados;
    if (!dados) return null;

    const entrada = Object.entries(dados)[0];
    if (!entrada) return null;
    const [periodo, pontos] = entrada as [string, Array<{ valor: string; geodsg: string }>];
    const ponto = pontos?.[0];
    if (!ponto) return null;

    const valor = Number(ponto.valor);
    if (!Number.isFinite(valor)) return null;

    return { periodo, valor, regiao: ponto.geodsg };
  } catch {
    return null;
  }
}

// Referência oficial do INE para um concelho — valor mediano de avaliação
// bancária (€/m²) e a variação homóloga (%) da região (NUTS II) onde o
// concelho se insere. Devolve null se o concelho não estiver mapeado ou se
// o INE não responder — nunca bloqueia o simulador, é só um extra.
export async function obterReferenciaIne(concelho: string): Promise<ReferenciaIne | null> {
  const geocod = GEOCOD_POR_CONCELHO[concelho];
  if (!geocod) return null;

  const [precos, variacao] = await Promise.all([
    pedirIndicador(INDICADOR_VALOR_M2, geocod),
    pedirIndicador(INDICADOR_VARIACAO_HOMOLOGA, geocod.slice(0, 2)),
  ]);

  if (!precos) return null;

  return {
    valorM2: precos.valor,
    periodo: precos.periodo,
    variacaoHomologa: variacao?.valor ?? null,
    regiao: variacao?.regiao ?? "",
  };
}
