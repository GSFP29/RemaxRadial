import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ehAdministrador } from "@/lib/consultores";
import { listarMetricasMarketing } from "@/lib/marketing-admin";
import { mesAnteriorISO, primeiroDiaMesISO } from "@/lib/marketing-formato";
import { DashboardMarketing } from "@/components/dashboard-marketing";

export default async function MarketingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // O layout já garante sessão; aqui garantimos que é administrador —
  // ferramenta de gestão da agência, não visível a consultores.
  if (!user || !(await ehAdministrador(user.id))) {
    redirect("/painel");
  }

  const mesAtual = primeiroDiaMesISO(new Date());
  const mesAnterior = mesAnteriorISO(mesAtual);
  const metricas = await listarMetricasMarketing(6);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Funil de Marketing</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        Métricas do plano de estratégia digital, ao lado das metas propostas.
        Atualização manual até as contas de Instagram, Facebook e Google Ads
        estarem ligadas.
      </p>

      <DashboardMarketing
        metricas={metricas}
        mesAtual={mesAtual}
        mesAnterior={mesAnterior}
      />
    </div>
  );
}
