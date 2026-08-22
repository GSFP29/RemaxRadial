import { createClient } from "@/lib/supabase/server";

export type DocumentoConsultor = {
  id: string;
  nome: string;
  categoria: string;
  idioma: "pt" | "en" | "pt_en";
  caminho_storage: string;
  extensao: string;
};

export async function listarDocumentos(): Promise<DocumentoConsultor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("documentos_consultor")
    .select("id, nome, categoria, idioma, caminho_storage, extensao")
    .order("categoria")
    .order("nome");

  return (data ?? []) as DocumentoConsultor[];
}
