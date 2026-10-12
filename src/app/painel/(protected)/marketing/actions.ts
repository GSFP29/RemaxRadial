"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { METRICAS } from "@/lib/marketing-formato";

// RLS já restringe esta tabela a is_administrador() — este action confia
// nisso para a autorização real; aqui só montamos as linhas a gravar.
export async function guardarMetricasMarketing(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const mes = formData.get("mes");
  if (typeof mes !== "string" || !mes) return;

  const linhas = METRICAS.map((m) => {
    const bruto = formData.get(m.chave);
    if (bruto === null || bruto === "") return null;
    const valor = Number(bruto);
    if (Number.isNaN(valor)) return null;
    return { mes, chave: m.chave, valor, criado_por: user?.id ?? null };
  }).filter((linha): linha is NonNullable<typeof linha> => linha !== null);

  if (linhas.length === 0) return;

  const { error } = await supabase
    .from("metricas_marketing_mensais")
    .upsert(linhas, { onConflict: "mes,chave" });

  if (error) throw error;

  revalidatePath("/painel/marketing");
}
