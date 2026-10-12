import { createClient } from "@/lib/supabase/server";

export async function ehAdministrador(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("consultores")
    .select("nivel")
    .eq("id", userId)
    .single();

  return data?.nivel === "administrador";
}

export type ConsultorBasico = { id: string; nome: string };

export async function listarConsultores(): Promise<ConsultorBasico[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("consultores")
    .select("id, nome")
    .eq("ativo", true)
    .order("nome", { ascending: true });

  return (data ?? []) as ConsultorBasico[];
}

export type ConsultorComFoto = { id: string; nome: string; foto_url: string | null };

export async function obterConsultorAtual(userId: string): Promise<ConsultorComFoto | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("consultores")
    .select("id, nome, foto_url")
    .eq("id", userId)
    .single();

  return (data as ConsultorComFoto) ?? null;
}
