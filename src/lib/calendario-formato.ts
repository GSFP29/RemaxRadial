export type TipoEvento = "visita" | "pessoal" | "escala" | "outro";

export type EventoCalendario = {
  id: string;
  consultor_id: string;
  tipo: TipoEvento;
  titulo: string;
  data_inicio: string;
  cliente_associado: string | null;
  notas: string | null;
};

export const ROTULO_TIPO: Record<TipoEvento, string> = {
  visita: "Visita",
  pessoal: "Pessoal",
  escala: "Escala",
  outro: "Outro",
};

// Cores de marca (vermelho/azul) reservadas para escala/visita — os
// tipos que mais importa destacar no relance. Pessoal e outro ficam
// neutros para não competir visualmente.
export const COR_TIPO: Record<TipoEvento, string> = {
  escala: "bg-brand-red text-white",
  visita: "bg-brand-blue text-white",
  pessoal: "bg-foreground/10 text-foreground",
  outro: "bg-foreground/10 text-foreground",
};

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export { DIAS_SEMANA };

export function formatarMesAnoPt(ano: number, mes: number): string {
  const data = new Date(ano, mes, 1);
  const texto = new Intl.DateTimeFormat("pt-PT", { month: "long", year: "numeric" }).format(data);
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function formatarHora(iso: string): string {
  return new Intl.DateTimeFormat("pt-PT", { hour: "2-digit", minute: "2-digit" }).format(
    new Date(iso),
  );
}

export function formatarDiaMesPt(iso: string): string {
  return new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short" }).format(
    new Date(iso),
  );
}

export function chaveDia(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

// Grelha do mês (semanas completas, Domingo a Sábado) — dias fora do mês
// vêm com `doMesAtual: false`, para se desenharem esbatidos.
export function grelhaDoMes(ano: number, mes: number): { data: Date; doMesAtual: boolean }[] {
  const primeiroDia = new Date(ano, mes, 1);
  const inicio = new Date(primeiroDia);
  inicio.setDate(inicio.getDate() - primeiroDia.getDay());

  const dias: { data: Date; doMesAtual: boolean }[] = [];
  const cursor = new Date(inicio);
  for (let i = 0; i < 42; i++) {
    dias.push({ data: new Date(cursor), doMesAtual: cursor.getMonth() === mes });
    cursor.setDate(cursor.getDate() + 1);
  }
  return dias;
}
