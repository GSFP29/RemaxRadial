"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// O ficheiro em si sobe direto do browser para o Storage (createClient
// do lado do cliente) — este action só grava os metadados depois de o
// upload ter sucedido.
export async function criarProjeto(formData: FormData) {
  const consultorId = String(formData.get("consultorId") ?? "");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const imagemPath = String(formData.get("imagemPath") ?? "");

  if (!consultorId || !titulo || !imagemPath) return;

  const supabase = await createClient();
  const { error } = await supabase.from("projetos_interativos").insert({
    consultor_id: consultorId,
    titulo,
    imagem_path: imagemPath,
    hotspots: [],
  });

  if (error) throw error;
  revalidatePath("/painel/projetos");
}

export async function guardarHotspots(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const hotspotsBruto = String(formData.get("hotspots") ?? "[]");

  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("projetos_interativos")
    .update({ hotspots: JSON.parse(hotspotsBruto) })
    .eq("id", id);

  if (error) throw error;
  revalidatePath(`/painel/projetos/${id}`);
  revalidatePath(`/projetos/${id}`);
}

export async function removerProjeto(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("projetos_interativos").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/painel/projetos");
}
