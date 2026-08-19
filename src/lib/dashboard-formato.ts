// Tipos e funções puras do dashboard de imóveis — sem acesso à base de
// dados, para poderem ser usadas pelo Client Component do painel.

export type AlteracaoImovel = {
  id: string;
  campo: string;
  valor_anterior: string | null;
  valor_novo: string | null;
  criado_em: string;
};

export type ImovelDashboard = {
  id: string;
  ref_remax: string;
  tipo: "venda" | "arrendamento";
  tipo_imovel: string | null;
  estado: string;
  preco_pedido: number | null;
  freguesia: string | null;
  concelho: string | null;
  data_angariacao: string | null;
  criado_em: string;
  dados_api: {
    marketDays?: number;
    previousPrice?: number | null;
    priceReductionPercentageValue?: number | null;
    lastPriceReductionDate?: string | null;
    userName?: string;
  } | null;
};

// Referências históricas — registo mestre de 22 anos, ver docs/benchmarks.md.
// Snapshot de 17 Ago 2026, não recalculado automaticamente.
export const BENCHMARKS = {
  medianaDiasVenda: 149,
  medianaDiasArrendamento: 29,
  medianaDiasCancelamento: 339,
  taxaSucesso: 56.7,
  taxaSucessoVenda: 49.7,
  taxaSucessoArrendamento: 76.2,
  imoveisComDescidaSnapshot: 9,
  imoveisCarteiraSnapshot: 93,
  maisDeUmAnoSnapshot: 24,
  idadeMedianaSnapshot: 157,
};

export function teveDescidaPreco(imovel: ImovelDashboard): boolean {
  const anterior = imovel.dados_api?.previousPrice;
  return (
    anterior != null &&
    imovel.preco_pedido != null &&
    anterior > imovel.preco_pedido
  );
}

export function diasEmCarteira(imovel: ImovelDashboard): number | null {
  if (typeof imovel.dados_api?.marketDays === "number") {
    return imovel.dados_api.marketDays;
  }
  const inicio = imovel.data_angariacao ?? imovel.criado_em;
  if (!inicio) return null;
  const ms = Date.now() - new Date(inicio).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function medianaBenchmarkPara(tipo: "venda" | "arrendamento"): number {
  return tipo === "venda"
    ? BENCHMARKS.medianaDiasVenda
    : BENCHMARKS.medianaDiasArrendamento;
}

export function formatarPrecoDashboard(valor: number | null): string {
  if (valor === null) return "—";
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(valor);
}

export function formatarData(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("pt-PT").format(new Date(iso));
}
