import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listarConsultores } from "@/lib/consultores";
import { listarReservasDoDia } from "@/lib/salas";
import { dataISO } from "@/lib/salas-formato";
import { PainelSalas } from "@/components/painel-salas";

export default async function SalasPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/painel/login");

  const { data: dataParam } = await searchParams;
  const dataSelecionada = dataParam ?? dataISO(new Date());

  const [reservas, consultores] = await Promise.all([
    listarReservasDoDia(dataSelecionada),
    listarConsultores(),
  ]);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Salas de reunião</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        Sala Paris e Sala Mundo — horários das 08:30 às 19:30.
      </p>

      <PainelSalas
        data={dataSelecionada}
        reservas={reservas}
        consultores={consultores}
        consultorAtualId={user.id}
      />
    </div>
  );
}
