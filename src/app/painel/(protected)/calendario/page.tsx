import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ehAdministrador, listarConsultores } from "@/lib/consultores";
import { listarEventosDoIntervalo, listarProximosEventos } from "@/lib/calendario";
import { grelhaDoMes } from "@/lib/calendario-formato";
import { obterOuCriarToken } from "@/lib/calendario-sync";
import { CalendarioMensal } from "@/components/calendario-mensal";
import { SincronizarCalendario } from "@/components/sincronizar-calendario";

export default async function CalendarioPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string; mes?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/painel/login");

  const isAdmin = await ehAdministrador(user.id);
  const hoje = new Date();
  const { ano: anoParam, mes: mesParam } = await searchParams;
  const ano = Number(anoParam) || hoje.getFullYear();
  const mes = mesParam !== undefined ? Number(mesParam) : hoje.getMonth();

  const grelha = grelhaDoMes(ano, mes);
  const desde = grelha[0].data;
  const ate = new Date(grelha[grelha.length - 1].data);
  ate.setDate(ate.getDate() + 1);

  const [eventos, proximos, consultores, token] = await Promise.all([
    listarEventosDoIntervalo(user.id, desde, ate),
    listarProximosEventos(user.id),
    isAdmin ? listarConsultores() : Promise.resolve([]),
    obterOuCriarToken(user.id),
  ]);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">O meu calendário</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        Visitas, eventos pessoais e escalas — tudo num só lugar.
      </p>

      <div className="mb-6">
        <SincronizarCalendario token={token} />
      </div>

      <CalendarioMensal
        ano={ano}
        mes={mes}
        eventos={eventos}
        proximos={proximos}
        consultorId={user.id}
        isAdmin={isAdmin}
        consultores={consultores}
      />
    </div>
  );
}
