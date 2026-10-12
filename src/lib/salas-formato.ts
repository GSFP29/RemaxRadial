export const SALAS = ["Sala Paris", "Sala Mundo"] as const;
export type Sala = (typeof SALAS)[number];

export type ReservaSala = {
  id: string;
  sala: Sala;
  data: string;
  hora_inicio: string;
  consultor_id: string;
  cliente_associado: string | null;
};

// 08:30 → 19:30, de 30 em 30 minutos (o último horário começa às 19:00,
// termina às 19:30 — o dia não vai além disso).
export function horariosDoDay(): string[] {
  const horarios: string[] = [];
  for (let minutos = 8 * 60 + 30; minutos <= 19 * 60; minutos += 30) {
    const h = String(Math.floor(minutos / 60)).padStart(2, "0");
    const m = String(minutos % 60).padStart(2, "0");
    horarios.push(`${h}:${m}`);
  }
  return horarios;
}

export function dataISO(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function formatarDataPt(dataISOStr: string): string {
  const [ano, mes, dia] = dataISOStr.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  const texto = new Intl.DateTimeFormat("pt-PT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(data);
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
