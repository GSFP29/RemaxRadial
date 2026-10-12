"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// RLS restringe escrita a is_administrador() — este action confia nisso.
export async function adicionarAvaliacao(formData: FormData) {
  const nomeAutor = formData.get("nome_autor");
  const texto = formData.get("texto");
  const estrelas = formData.get("estrelas");
  const urlAvaliacao = formData.get("url_avaliacao");

  if (typeof nomeAutor !== "string" || typeof texto !== "string" || !nomeAutor || !texto) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("avaliacoes_google").insert({
    nome_autor: nomeAutor,
    texto,
    estrelas: Number(estrelas) || 5,
    url_avaliacao: typeof urlAvaliacao === "string" && urlAvaliacao ? urlAvaliacao : null,
  });

  if (error) throw error;
  revalidatePath("/painel/avaliacoes");
  revalidatePath("/");
}

export async function removerAvaliacao(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("avaliacoes_google").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/painel/avaliacoes");
  revalidatePath("/");
}
