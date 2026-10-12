"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// RLS decide quem pode escrever em qual lead — este action só monta o
// update. Um consultor só atualiza as suas próprias leads; o
// administrador atualiza (e atribui) qualquer uma.
export async function atualizarLead(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const estado = String(formData.get("estado") ?? "");
  const notas = String(formData.get("notas") ?? "");

  if (!id || !estado) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ estado, notas: notas || null, atualizado_em: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/painel/leads");
}

export async function atribuirLead(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const consultorId = String(formData.get("consultorId") ?? "");

  if (!id || !consultorId) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ consultor_id: consultorId, atualizado_em: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/painel/leads");
}
