import { createClient } from "@/lib/supabase/server";

export type AvaliacaoGoogle = {
  id: string;
  nome_autor: string;
  texto: string;
  estrelas: number;
  url_avaliacao: string | null;
};

export async function listarAvaliacoes5Estrelas(): Promise<AvaliacaoGoogle[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("avaliacoes_google")
    .select("id, nome_autor, texto, estrelas, url_avaliacao")
    .eq("estrelas", 5)
    .order("criado_em", { ascending: false })
    .limit(6);

  return (data ?? []) as AvaliacaoGoogle[];
}

export async function listarTodasAvaliacoes(): Promise<AvaliacaoGoogle[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("avaliacoes_google")
    .select("id, nome_autor, texto, estrelas, url_avaliacao")
    .order("criado_em", { ascending: false });

  return (data ?? []) as AvaliacaoGoogle[];
}
