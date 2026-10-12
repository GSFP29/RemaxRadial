"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { dataUTCDeLisboa } from "@/lib/tempo";

// RLS decide quem pode escrever em qual consultor_id — este action só
// monta os dados. Um consultor normal só consegue gravar no seu próprio
// consultor_id (a política rejeita o resto); o administrador pode em
// qualquer um, o que é usado para atribuir escalas.
export async function criarEvento(formData: FormData) {
  const consultorId = String(formData.get("consultorId") ?? "");
  const tipo = String(formData.get("tipo") ?? "pessoal");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const data = String(formData.get("data") ?? "");
  const hora = String(formData.get("hora") ?? "09:00");
  const clienteAssociado = String(formData.get("clienteAssociado") ?? "").trim();
  const notas = String(formData.get("notas") ?? "").trim();

  if (!consultorId || !titulo || !data) return;

  const supabase = await createClient();
  const { error } = await supabase.from("eventos_calendario").insert({
    consultor_id: consultorId,
    tipo,
    titulo,
    data_inicio: dataUTCDeLisboa(data, hora).toISOString(),
    cliente_associado: clienteAssociado || null,
    notas: notas || null,
  });

  if (error) throw error;
  revalidatePath("/painel/calendario");
}

export async function removerEvento(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("eventos_calendario").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/painel/calendario");
}
