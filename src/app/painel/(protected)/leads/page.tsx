import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ehAdministrador, listarConsultores } from "@/lib/consultores";
import { listarLeadsPorAtribuir, listarMinhasLeads } from "@/lib/leads";
import { PainelLeads } from "@/components/painel-leads";

export default async function LeadsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/painel/login");

  const isAdmin = await ehAdministrador(user.id);

  const [minhasLeads, porAtribuir, consultores] = await Promise.all([
    listarMinhasLeads(user.id),
    isAdmin ? listarLeadsPorAtribuir() : Promise.resolve([]),
    isAdmin ? listarConsultores() : Promise.resolve([]),
  ]);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">As minhas leads</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        Funil pessoal — a vermelho o que está parado há mais de 48 horas.
      </p>

      <PainelLeads
        minhasLeads={minhasLeads}
        porAtribuir={porAtribuir}
        consultores={consultores}
        isAdmin={isAdmin}
      />
    </div>
  );
}
