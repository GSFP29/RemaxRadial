import { createClient } from "@/lib/supabase/server";
import type { EventoCalendario } from "@/lib/calendario-formato";

// Traz a grelha de 6 semanas inteira (pode incluir dias do mês anterior
// e seguinte), para os indicadores aparecerem também nesses dias.
export async function listarEventosDoIntervalo(
  consultorId: string,
  desde: Date,
  ate: Date,
): Promise<EventoCalendario[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("eventos_calendario")
    .select("id, consultor_id, tipo, titulo, data_inicio, cliente_associado, notas")
    .eq("consultor_id", consultorId)
    .gte("data_inicio", desde.toISOString())
    .lt("data_inicio", ate.toISOString())
    .order("data_inicio", { ascending: true });

  return (data ?? []) as EventoCalendario[];
}

export async function listarProximosEventos(
  consultorId: string,
  limite = 5,
): Promise<EventoCalendario[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("eventos_calendario")
    .select("id, consultor_id, tipo, titulo, data_inicio, cliente_associado, notas")
    .eq("consultor_id", consultorId)
    .gte("data_inicio", new Date().toISOString())
    .order("data_inicio", { ascending: true })
    .limit(limite);

  return (data ?? []) as EventoCalendario[];
}
