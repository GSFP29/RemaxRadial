import { createClient } from "@/lib/supabase/server";
import { ehAdministrador } from "@/lib/consultores";
import { listarParceiros } from "@/lib/parceiros-admin";
import { PainelParceiros } from "@/components/painel-parceiros";

export default async function ParceirosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user ? await ehAdministrador(user.id) : false;
  const parceiros = await listarParceiros();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Contactos de Parceiros</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        Fornecedores da agência, por categoria, com condições negociadas.
      </p>

      <PainelParceiros parceiros={parceiros} isAdmin={isAdmin} />
    </div>
  );
}
