"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function reservarSala(formData: FormData) {
  const sala = String(formData.get("sala") ?? "");
  const data = String(formData.get("data") ?? "");
  const horaInicio = String(formData.get("horaInicio") ?? "");
  const consultorId = String(formData.get("consultorId") ?? "");
  const clienteAssociado = String(formData.get("clienteAssociado") ?? "").trim();

  if (!sala || !data || !horaInicio || !consultorId) return;

  const supabase = await createClient();
  const { error } = await supabase.from("reservas_salas").insert({
    sala,
    data,
    hora_inicio: horaInicio,
    consultor_id: consultorId,
    cliente_associado: clienteAssociado || null,
  });

  // Erro mais provável: horário já reservado por outra pessoa entre o
  // carregamento da página e o submit (unique constraint). Ignorar em
  // silêncio faz o pedido "desaparecer" sem explicação — por isso propaga.
  if (error) throw error;
  revalidatePath("/painel/salas");
}

export async function cancelarReserva(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("reservas_salas").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/painel/salas");
}
