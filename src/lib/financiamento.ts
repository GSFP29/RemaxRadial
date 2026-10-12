// Matemática financeira padrão (fórmula de amortização francesa/prestação
// constante) — segura de calcular nós próprios. Propositadamente NÃO
// inclui IMT, Imposto de Selo ou custos de escritura: são tabelas fiscais
// que mudam e onde um erro nosso teria consequências reais para alguém.
// Para isso, a página remete para o simulador da MaxFinance Delta.
export type ResultadoSimulacao = {
  prestacaoMensal: number;
  montanteFinanciado: number;
  ltv: number;
  taxaEsforco: number | null;
};

export function simularFinanciamento({
  valorImovel,
  entrada,
  taxaTanPercent,
  prazoAnos,
  rendimentoLiquido,
}: {
  valorImovel: number;
  entrada: number;
  taxaTanPercent: number;
  prazoAnos: number;
  rendimentoLiquido: number | null;
}): ResultadoSimulacao | null {
  if (valorImovel <= 0 || prazoAnos <= 0) return null;

  const montanteFinanciado = Math.max(0, valorImovel - entrada);
  const rMensal = taxaTanPercent / 100 / 12;
  const n = prazoAnos * 12;

  const prestacaoMensal =
    rMensal === 0
      ? montanteFinanciado / n
      : (montanteFinanciado * rMensal) / (1 - Math.pow(1 + rMensal, -n));

  const ltv = (montanteFinanciado / valorImovel) * 100;
  const taxaEsforco =
    rendimentoLiquido && rendimentoLiquido > 0
      ? (prestacaoMensal / rendimentoLiquido) * 100
      : null;

  return { prestacaoMensal, montanteFinanciado, ltv, taxaEsforco };
}

export function formatarEuro(valor: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(valor);
}
