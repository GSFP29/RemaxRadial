export type EstadoLead = "novo" | "contactado" | "qualificado" | "perdido" | "convertido";

export type Lead = {
  id: string;
  origem: string;
  nome: string | null;
  telefone: string | null;
  email: string | null;
  mensagem: string | null;
  notas: string | null;
  imovel_id: string | null;
  consultor_id: string | null;
  estado: string;
  criado_em: string;
  atualizado_em: string;
};

export const ESTADOS_LEAD: EstadoLead[] = [
  "novo",
  "contactado",
  "qualificado",
  "convertido",
  "perdido",
];

export const ROTULO_ESTADO: Record<string, string> = {
  novo: "Novo",
  contactado: "Contactado",
  qualificado: "Qualificado",
  convertido: "Convertido",
  perdido: "Perdido",
};

export const ROTULO_ORIGEM: Record<string, string> = {
  portal_remax: "Portal RE/MAX",
  idealista: "Idealista",
  imovirtual: "Imovirtual",
  formulario_site: "Formulário do site",
  telefone: "Telefone",
  casayes: "CasaYes",
  outro: "Outro",
};

export const COR_ESTADO: Record<string, string> = {
  novo: "bg-chart-1/10 text-chart-1",
  contactado: "bg-chart-4/10 text-chart-4",
  qualificado: "bg-chart-3/10 text-chart-3",
  convertido: "bg-brand-blue/10 text-brand-blue",
  perdido: "bg-foreground/10 text-foreground-secondary",
};

const HORAS_PARA_ATRASO = 48;
const ESTADOS_FECHADOS = new Set(["perdido", "convertido"]);

export function estaEmAtraso(lead: Lead): boolean {
  if (ESTADOS_FECHADOS.has(lead.estado)) return false;
  const horasParadas = (Date.now() - new Date(lead.atualizado_em).getTime()) / 3_600_000;
  return horasParadas >= HORAS_PARA_ATRASO;
}

export function tempoParado(lead: Lead): string {
  const horas = (Date.now() - new Date(lead.atualizado_em).getTime()) / 3_600_000;
  if (horas < 1) return "há menos de 1h";
  if (horas < 24) return `há ${Math.floor(horas)}h`;
  return `há ${Math.floor(horas / 24)} dias`;
}
