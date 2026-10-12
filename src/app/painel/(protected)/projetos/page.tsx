import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listarMeusProjetos } from "@/lib/projetos";
import { urlImagemProjeto } from "@/lib/projetos-formato";
import { FormularioNovoProjeto } from "@/components/formulario-novo-projeto";

export default async function ProjetosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/painel/login");

  const projetos = await listarMeusProjetos(user.id);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Projetos interativos</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        Carrega uma planta, marca pontos de interesse e partilha um link
        interativo com o cliente.
      </p>

      <div className="mb-8">
        <FormularioNovoProjeto consultorId={user.id} />
      </div>

      {projetos.length === 0 ? (
        <p className="text-sm text-foreground-secondary">
          Ainda não carregaste nenhum projeto.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projetos.map((p) => (
            <Link
              key={p.id}
              href={`/painel/projetos/${p.id}`}
              className="overflow-hidden rounded-xl border border-grid transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urlImagemProjeto(p.imagem_path)}
                alt={p.titulo}
                className="h-40 w-full object-cover"
              />
              <div className="p-3">
                <p className="font-semibold">{p.titulo}</p>
                <p className="text-xs text-foreground-secondary">
                  {p.hotspots.length} {p.hotspots.length === 1 ? "ponto marcado" : "pontos marcados"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
