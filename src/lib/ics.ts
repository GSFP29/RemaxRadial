import { componentesEmLisboa } from "@/lib/tempo";

export type EventoICS = {
  uid: string;
  inicio: Date;
  duracaoMinutos: number;
  titulo: string;
  descricao?: string;
};

function escaparTexto(texto: string): string {
  return texto.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

// Formato "local time com TZID" (sem "Z") — deixa a aplicação de
// calendário do consultor tratar do horário de verão sozinha, em vez de
// nós tentarmos acertar o desvio.
function formatarLocal(data: Date): string {
  const p = componentesEmLisboa(data);
  const dois = (n: number) => String(n).padStart(2, "0");
  return `${p.ano}${dois(p.mes)}${dois(p.dia)}T${dois(p.hora)}${dois(p.minuto)}${dois(p.segundo)}`;
}

function formatarUTC(data: Date): string {
  return data.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function gerarICS(eventos: EventoICS[], nomeCalendario: string): string {
  const linhas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RE/MAX Radial//Calendario//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escaparTexto(nomeCalendario)}`,
    "X-WR-TIMEZONE:Europe/Lisbon",
  ];

  for (const ev of eventos) {
    const fim = new Date(ev.inicio.getTime() + ev.duracaoMinutos * 60_000);
    linhas.push(
      "BEGIN:VEVENT",
      `UID:${ev.uid}@radial.remaxradial.workers.dev`,
      `DTSTAMP:${formatarUTC(new Date())}`,
      `DTSTART;TZID=Europe/Lisbon:${formatarLocal(ev.inicio)}`,
      `DTEND;TZID=Europe/Lisbon:${formatarLocal(fim)}`,
      `SUMMARY:${escaparTexto(ev.titulo)}`,
      ...(ev.descricao ? [`DESCRIPTION:${escaparTexto(ev.descricao)}`] : []),
      "END:VEVENT",
    );
  }

  linhas.push("END:VCALENDAR");
  return linhas.join("\r\n");
}
