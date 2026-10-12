import { createClient } from "@/lib/supabase/server";
import { ehAdministrador } from "@/lib/consultores";
import { listarRecursosBiblioteca } from "@/lib/biblioteca";
import { PainelBiblioteca } from "@/components/painel-biblioteca";

export default async function BibliotecaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user ? await ehAdministrador(user.id) : false;
  const recursos = await listarRecursosBiblioteca();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Biblioteca</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        Conteúdos educativos escolhidos pela agência.
      </p>

      <PainelBiblioteca recursos={recursos} isAdmin={isAdmin} />
    </div>
  );
}
