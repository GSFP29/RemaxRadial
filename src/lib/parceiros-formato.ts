// Categorias de parceiros, por ordem de importância para a atividade da
// agência (frequência de uso num ciclo normal de angariação → fecho).
// Ver CLAUDE.md secção 9 e docs/decisoes.md.
export const CATEGORIAS_PARCEIROS = [
  "Fotografia e Vídeo",
  "Certificação Energética",
  "Intermediários de Crédito",
  "Solicitadores e Advogados",
  "Notários",
  "Obras e Remodelação",
  "Pintores",
  "Limpezas",
  "Arquitetos",
  "Mudanças",
  "Gráficas",
] as const;

export type CategoriaParceiro = (typeof CATEGORIAS_PARCEIROS)[number];

export type Parceiro = {
  id: string;
  categoria: string;
  nome: string;
  contacto: string | null;
  condicoes: string | null;
};
