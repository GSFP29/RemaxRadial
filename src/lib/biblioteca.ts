import { createClient } from "@/lib/supabase/server";

export type RecursoBiblioteca = {
  id: string;
  titulo: string;
  descricao: string | null;
  url: string;
  categoria: string | null;
};

export async function listarRecursosBiblioteca(): Promise<RecursoBiblioteca[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("biblioteca_recursos")
    .select("id, titulo, descricao, url, categoria")
    .order("criado_em", { ascending: false });

  return (data ?? []) as RecursoBiblioteca[];
}
