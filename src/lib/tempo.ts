// Conversão de hora local de Portugal (Europe/Lisbon, com DST) para UTC e
// vice-versa, sem bibliotecas externas. Necessário porque o Cloudflare
// Workers corre sempre em UTC — sem isto, `new Date("2026-08-25T09:00:00")`
// interpretava "09:00" como UTC em vez de hora de Lisboa, desfasando os
// eventos em 1h no horário de verão.

const FORMATADOR_LISBOA = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Lisbon",
  hour12: false,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function partesEm(data: Date, formatador: Intl.DateTimeFormat) {
  const partes = Object.fromEntries(
    formatador.formatToParts(data).filter((p) => p.type !== "literal").map((p) => [p.type, p.value]),
  );
  return {
    ano: Number(partes.year),
    mes: Number(partes.month),
    dia: Number(partes.day),
    hora: Number(partes.hour === "24" ? "0" : partes.hour),
    minuto: Number(partes.minute),
    segundo: Number(partes.second),
  };
}

// "2026-08-25" + "09:00" (hora de Lisboa) → instante UTC correto.
export function dataUTCDeLisboa(data: string, hora: string): Date {
  const ingenuo = new Date(`${data}T${hora}:00Z`);
  const p = partesEm(ingenuo, FORMATADOR_LISBOA);
  const comoSeFosseUTC = new Date(Date.UTC(p.ano, p.mes - 1, p.dia, p.hora, p.minuto, p.segundo));
  const desvioMs = ingenuo.getTime() - comoSeFosseUTC.getTime();
  return new Date(ingenuo.getTime() + desvioMs);
}

// Instante UTC → componentes civis em hora de Lisboa (para gerar o .ics).
export function componentesEmLisboa(dataUTC: Date) {
  return partesEm(dataUTC, FORMATADOR_LISBOA);
}
