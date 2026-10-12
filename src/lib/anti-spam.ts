// Proteção anti-spam leve para os formulários públicos — sem CAPTCHA (mau
// para conversão) nem serviço externo. Dois truques combinados:
// 1. Campo isco (honeypot): invisível para uma pessoa, tentador para um
//    bot que preenche tudo. Se vier preenchido, é bot.
// 2. Tempo mínimo: um bot costuma submeter quase instantaneamente; uma
//    pessoa demora sempre pelo menos alguns segundos a preencher um
//    formulário. Ver src/components/campo-anti-spam.tsx para os campos.
const TEMPO_MINIMO_MS = 2000;

export function passouAntiSpam(formData: FormData): boolean {
  const isco = String(formData.get("empresa") ?? "").trim();
  if (isco) return false;

  const carregadoEm = Number(formData.get("carregadoEm"));
  if (!carregadoEm || Number.isNaN(carregadoEm)) return false;
  if (Date.now() - carregadoEm < TEMPO_MINIMO_MS) return false;

  return true;
}
