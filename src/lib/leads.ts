import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/lib/leads-formato";

const CAMPOS =
  "id, origem, nome, telefone, email, mensagem, notas, imovel_id, consultor_id, estado, criado_em, atualizado_em";

export async function listarMinhasLeads(consultorId: string): Promise<Lead[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select(CAMPOS)
    .eq("consultor_id", consultorId)
    .order("atualizado_em", { ascending: true });

  return (data ?? []) as Lead[];
}

export async function listarLeadsPorAtribuir(): Promise<Lead[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select(CAMPOS)
    .is("consultor_id", null)
    .order("criado_em", { ascending: false });

  return (data ?? []) as Lead[];
}
