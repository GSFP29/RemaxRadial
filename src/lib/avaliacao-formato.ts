export const TIPOLOGIAS_AVALIACAO = ["T0", "T1", "T2", "T3", "T4", "T5", "T6", "T7"] as const;

// Amostra mínima para nos sentirmos confortáveis a mostrar um número —
// abaixo disto, é honesto dizer que não há dados suficientes em vez de
// inventar uma estimativa com base em 1 ou 2 imóveis.
export const AMOSTRA_MINIMA = 3;

export function mediana(valores: number[]): number {
  return percentil(valores, 50);
}

// Interpolação linear (método usado pelo Excel/numpy por omissão) —
// p entre 0 e 100.
export function percentil(valores: number[], p: number): number {
  const ordenados = [...valores].sort((a, b) => a - b);
  if (ordenados.length === 1) return ordenados[0];
  const indice = (p / 100) * (ordenados.length - 1);
  const baixo = Math.floor(indice);
  const alto = Math.ceil(indice);
  if (baixo === alto) return ordenados[baixo];
  const fracao = indice - baixo;
  return ordenados[baixo] + (ordenados[alto] - ordenados[baixo]) * fracao;
}

export function formatarEuro(valor: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    useGrouping: "always",
  }).format(valor);
}
