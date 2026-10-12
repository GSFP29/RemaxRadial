import { createClient } from "@/lib/supabase/server";
import type { Parceiro } from "@/lib/parceiros-formato";

export async function listarParceiros(): Promise<Parceiro[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("parceiros")
    .select("id, categoria, nome, contacto, condicoes")
    .order("nome", { ascending: true });

  return (data ?? []) as Parceiro[];
}
