// Tipos e funções puras do Funil de Marketing — sem acesso à base de dados,
// para poderem ser usadas pelo Client Component do painel.
//
// Metas extraídas de Desktop/Radial/Marketing/Radial_Estrategia_Digital_v3.html
// (partes 11 «Métricas de Sucesso» e 12 «Próximos Passos»). São as metas do
// plano proposto pelo parceiro de marketing, não benchmarks da carteira.

export type Categoria = {
  chave: string;
  rotulo: string;
  corClasse: string;
};

export const CATEGORIAS: Categoria[] = [
  { chave: "banco_produtos", rotulo: "Banco de Produtos", corClasse: "text-chart-2" },
  { chave: "presenca_digital", rotulo: "Presença Digital", corClasse: "text-chart-1" },
  { chave: "trafego_pago", rotulo: "Tráfego Pago", corClasse: "text-chart-3" },
  { chave: "recrutamento", rotulo: "Recrutamento", corClasse: "text-chart-4" },
];

export type Unidade = "un" | "%" | "eur" | "x";
export type Comparador = "minimo" | "maximo" | "informativo";

export type Metrica = {
  chave: string;
  categoria: string;
  rotulo: string;
  unidade: Unidade;
  meta: number | null;
  comparador: Comparador;
};

export const METRICAS: Metrica[] = [
  // Banco de Produtos
  { chave: "angariacoes_mes", categoria: "banco_produtos", rotulo: "Angariações no mês", unidade: "un", meta: null, comparador: "informativo" },
  { chave: "taxa_conversao_visita_mandato", categoria: "banco_produtos", rotulo: "Conversão visita → mandato", unidade: "%", meta: 60, comparador: "minimo" },
  { chave: "mandatos_canal_digital_pct", categoria: "banco_produtos", rotulo: "Mandatos via canal digital", unidade: "%", meta: 50, comparador: "minimo" },
  { chave: "avaliacoes_gratuitas_pedidas", categoria: "banco_produtos", rotulo: "Avaliações gratuitas pedidas", unidade: "un", meta: null, comparador: "informativo" },
  { chave: "taxa_conversao_avaliacao_mandato", categoria: "banco_produtos", rotulo: "Conversão avaliação → mandato", unidade: "%", meta: null, comparador: "informativo" },

  // Presença Digital
  { chave: "seguidores_instagram", categoria: "presenca_digital", rotulo: "Seguidores Instagram", unidade: "un", meta: 5000, comparador: "minimo" },
  { chave: "avaliacoes_google_5estrelas", categoria: "presenca_digital", rotulo: "Avaliações 5★ Google", unidade: "un", meta: 50, comparador: "minimo" },
  { chave: "participantes_cafe_mercado", categoria: "presenca_digital", rotulo: "Participantes · Café com o Mercado", unidade: "un", meta: 18, comparador: "minimo" },
  { chave: "taxa_retorno_cafe", categoria: "presenca_digital", rotulo: "Taxa de retorno ao Café", unidade: "%", meta: 30, comparador: "minimo" },
  { chave: "alcance_medio_publicacao", categoria: "presenca_digital", rotulo: "Alcance médio por publicação", unidade: "un", meta: null, comparador: "informativo" },
  { chave: "taxa_engagement", categoria: "presenca_digital", rotulo: "Taxa de engagement", unidade: "%", meta: null, comparador: "informativo" },
  { chave: "cliques_whatsapp_instagram", categoria: "presenca_digital", rotulo: "Cliques p/ WhatsApp (Instagram)", unidade: "un", meta: null, comparador: "informativo" },

  // Tráfego Pago
  { chave: "custo_lead_meta_compradores", categoria: "trafego_pago", rotulo: "Custo/lead · Meta Ads compradores", unidade: "eur", meta: 15, comparador: "maximo" },
  { chave: "custo_lead_google_proprietarios", categoria: "trafego_pago", rotulo: "Custo/lead · Google Ads proprietários", unidade: "eur", meta: 25, comparador: "maximo" },
  { chave: "roas", categoria: "trafego_pago", rotulo: "ROAS", unidade: "x", meta: 3, comparador: "minimo" },

  // Recrutamento
  { chave: "candidaturas_qualificadas", categoria: "recrutamento", rotulo: "Candidaturas qualificadas", unidade: "un", meta: 3, comparador: "minimo" },
  { chave: "nps_interno", categoria: "recrutamento", rotulo: "NPS interno", unidade: "%", meta: 80, comparador: "minimo" },
  { chave: "taxa_saida_anual", categoria: "recrutamento", rotulo: "Taxa de saída anual", unidade: "%", meta: 30, comparador: "maximo" },
];

export function estadoMetrica(m: Metrica, valor: number): "bom" | "mau" | "neutro" {
  if (m.meta === null || m.comparador === "informativo") return "neutro";
  if (m.comparador === "minimo") return valor >= m.meta ? "bom" : "mau";
  return valor <= m.meta ? "bom" : "mau";
}

export function formatarValorMetrica(m: Metrica, valor: number): string {
  switch (m.unidade) {
    case "%":
      return `${valor}%`;
    case "eur":
      return new Intl.NumberFormat("pt-PT", {
        style: "currency",
        currency: "EUR",
        useGrouping: true,
        maximumFractionDigits: 0,
      }).format(valor);
    case "x":
      return `${valor}×`;
    default:
      return new Intl.NumberFormat("pt-PT").format(valor);
  }
}

export function formatarMetaMetrica(m: Metrica): string {
  if (m.meta === null) return "Sem meta fixa";
  const simbolo = m.comparador === "maximo" ? "≤" : "≥";
  return `Meta: ${simbolo} ${formatarValorMetrica(m, m.meta)}`;
}

export function primeiroDiaMesISO(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  return `${ano}-${mes}-01`;
}

export function mesAnteriorISO(mesISO: string): string {
  const [ano, mes] = mesISO.split("-").map(Number);
  const data = new Date(ano, mes - 1 - 1, 1);
  return primeiroDiaMesISO(data);
}

export function formatarMesPt(mesISO: string): string {
  const [ano, mes] = mesISO.split("-").map(Number);
  const data = new Date(ano, mes - 1, 1);
  const texto = new Intl.DateTimeFormat("pt-PT", { month: "long", year: "numeric" }).format(data);
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
