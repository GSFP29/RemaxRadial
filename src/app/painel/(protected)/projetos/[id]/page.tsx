import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ehAdministrador } from "@/lib/consultores";
import { obterProjeto } from "@/lib/projetos";
import { PlantaInterativa } from "@/components/planta-interativa";

export default async function EditarProjetoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/painel/login");

  const projeto = await obterProjeto(id);
  if (!projeto) notFound();

  const isAdmin = await ehAdministrador(user.id);
  if (projeto.consultor_id !== user.id && !isAdmin) redirect("/painel/projetos");

  return (
    <div>
      <Link href="/painel/projetos" className="mb-4 inline-block text-sm text-brand-blue">
        ← Voltar
      </Link>
      <h1 className="mb-1 text-2xl font-bold">{projeto.titulo}</h1>
      <p className="mb-4 text-sm text-foreground-secondary">
        Clica na planta para marcares um ponto de interesse. Link para
        partilhar com o cliente:{" "}
        <a href={`/projetos/${projeto.id}`} target="_blank" className="font-semibold text-brand-blue">
          /projetos/{projeto.id} →
        </a>
      </p>

      <PlantaInterativa projeto={projeto} editavel />
    </div>
  );
}
