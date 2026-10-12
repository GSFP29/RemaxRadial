"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// O ficheiro em si sobe direto do browser para o Storage (createClient do
// lado do cliente) — este action só grava o URL depois de o upload ter
// sucesso. Cada consultor só pode atualizar a própria foto (RLS).
export async function atualizarFotoConsultor(consultorId: string, fotoUrl: string) {
  if (!consultorId || !fotoUrl) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("consultores")
    .update({ foto_url: fotoUrl })
    .eq("id", consultorId);

  if (error) throw error;
  revalidatePath("/painel/templates");
}
