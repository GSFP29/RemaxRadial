import { createClient } from "@/lib/supabase/server";
import type { ProjetoInterativo } from "@/lib/projetos-formato";

const CAMPOS = "id, titulo, imagem_path, hotspots, consultor_id, criado_em";

export async function listarMeusProjetos(consultorId: string): Promise<ProjetoInterativo[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projetos_interativos")
    .select(CAMPOS)
    .eq("consultor_id", consultorId)
    .order("criado_em", { ascending: false });

  return (data ?? []) as unknown as ProjetoInterativo[];
}

export async function obterProjeto(id: string): Promise<ProjetoInterativo | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projetos_interativos")
    .select(CAMPOS)
    .eq("id", id)
    .maybeSingle();

  return data as unknown as ProjetoInterativo | null;
}
