"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// RLS restringe escrita a is_administrador() — este action confia nisso.
export async function adicionarParceiro(formData: FormData) {
  const categoria = formData.get("categoria");
  const nome = formData.get("nome");
  const contacto = formData.get("contacto");
  const condicoes = formData.get("condicoes");

  if (typeof categoria !== "string" || typeof nome !== "string" || !categoria || !nome) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("parceiros").insert({
    categoria,
    nome,
    contacto: typeof contacto === "string" && contacto ? contacto : null,
    condicoes: typeof condicoes === "string" && condicoes ? condicoes : null,
  });

  if (error) throw error;
  revalidatePath("/painel/parceiros");
}

export async function removerParceiro(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("parceiros").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/painel/parceiros");
}
