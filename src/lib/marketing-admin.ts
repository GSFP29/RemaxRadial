import { createClient } from "@/lib/supabase/server";

export type MetricaMensal = {
  mes: string;
  chave: string;
  valor: number;
};

// Traz os últimos N meses (por omissão, 6 — mês atual + anterior para
// comparação, com margem). A tabela é pequena (dezenas de linhas por mês).
export async function listarMetricasMarketing(mesesAtras = 6): Promise<MetricaMensal[]> {
  const supabase = await createClient();
  const desde = new Date();
  desde.setMonth(desde.getMonth() - mesesAtras);
  const desdeISO = `${desde.getFullYear()}-${String(desde.getMonth() + 1).padStart(2, "0")}-01`;

  const { data } = await supabase
    .from("metricas_marketing_mensais")
    .select("mes, chave, valor")
    .gte("mes", desdeISO)
    .order("mes", { ascending: true });

  return (data ?? []) as MetricaMensal[];
}
