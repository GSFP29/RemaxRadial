import { createAdminClient } from "@/lib/supabase/admin";
import { consultorIdPorToken } from "@/lib/calendario-sync";
import { gerarICS, type EventoICS } from "@/lib/ics";
import { dataUTCDeLisboa } from "@/lib/tempo";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const consultorId = await consultorIdPorToken(token);
  if (!consultorId) return new Response("Não encontrado", { status: 404 });

  const supabase = createAdminClient();

  const desde = new Date();
  desde.setDate(desde.getDate() - 30);
  const ate = new Date();
  ate.setDate(ate.getDate() + 365);

  const [{ data: eventos }, { data: reservas }] = await Promise.all([
    supabase
      .from("eventos_calendario")
      .select("id, titulo, data_inicio, cliente_associado, notas")
      .eq("consultor_id", consultorId)
      .gte("data_inicio", desde.toISOString())
      .lte("data_inicio", ate.toISOString()),
    supabase
      .from("reservas_salas")
      .select("id, sala, data, hora_inicio, cliente_associado")
      .eq("consultor_id", consultorId)
      .gte("data", desde.toISOString().slice(0, 10))
      .lte("data", ate.toISOString().slice(0, 10)),
  ]);

  const itens: EventoICS[] = [
    ...(eventos ?? []).map((e) => ({
      uid: `evento-${e.id}`,
      inicio: new Date(e.data_inicio),
      duracaoMinutos: 60,
      titulo: e.titulo,
      descricao: [e.cliente_associado, e.notas].filter(Boolean).join(" — ") || undefined,
    })),
    ...(reservas ?? []).map((r) => ({
      uid: `sala-${r.id}`,
      inicio: dataUTCDeLisboa(r.data, r.hora_inicio.slice(0, 5)),
      duracaoMinutos: 30,
      titulo: `Sala: ${r.sala}`,
      descricao: r.cliente_associado ?? undefined,
    })),
  ];

  const corpo = gerarICS(itens, "RE/MAX Radial — O meu calendário");

  return new Response(corpo, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="radial-calendario.ics"',
      "Cache-Control": "no-store",
    },
  });
}
