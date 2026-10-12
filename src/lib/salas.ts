import { createClient } from "@/lib/supabase/server";
import type { ReservaSala } from "@/lib/salas-formato";

export async function listarReservasDoDia(data: string): Promise<ReservaSala[]> {
  const supabase = await createClient();
  const { data: linhas } = await supabase
    .from("reservas_salas")
    .select("id, sala, data, hora_inicio, consultor_id, cliente_associado")
    .eq("data", data);

  return (linhas ?? []) as ReservaSala[];
}
