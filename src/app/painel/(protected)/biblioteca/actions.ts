"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// RLS restringe escrita a is_administrador() — este action confia nisso.
export async function adicionarRecursoBiblioteca(formData: FormData) {
  const titulo = formData.get("titulo");
  const url = formData.get("url");
  const descricao = formData.get("descricao");
  const categoria = formData.get("categoria");

  if (typeof titulo !== "string" || typeof url !== "string" || !titulo || !url) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("biblioteca_recursos").insert({
    titulo,
    url,
    descricao: typeof descricao === "string" && descricao ? descricao : null,
    categoria: typeof categoria === "string" && categoria ? categoria : null,
  });

  if (error) throw error;
  revalidatePath("/painel/biblioteca");
}

export async function removerRecursoBiblioteca(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("biblioteca_recursos").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/painel/biblioteca");
}
