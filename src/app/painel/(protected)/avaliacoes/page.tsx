import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ehAdministrador } from "@/lib/consultores";
import { listarTodasAvaliacoes } from "@/lib/avaliacoes";
import { PainelAvaliacoes } from "@/components/painel-avaliacoes";

export default async function AvaliacoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await ehAdministrador(user.id))) {
    redirect("/painel");
  }

  const avaliacoes = await listarTodasAvaliacoes();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Avaliações do Google</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        Só as de 5 estrelas aparecem na homepage. Copia o texto diretamente
        do Google Meu Negócio.
      </p>

      <PainelAvaliacoes avaliacoes={avaliacoes} />
    </div>
  );
}
