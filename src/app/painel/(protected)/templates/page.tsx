import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { obterConsultorAtual } from "@/lib/consultores";
import { GaleriaTemplatesMarketing } from "@/components/galeria-templates-marketing";

export default async function TemplatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/painel/login");

  const consultor = await obterConsultorAtual(user.id);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Templates de Marketing</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        Escolhe um template, adiciona as tuas fotos e descarrega a imagem pronta para publicar.
      </p>

      <GaleriaTemplatesMarketing
        consultorId={user.id}
        consultorNome={consultor?.nome ?? ""}
        fotoConsultorUrl={consultor?.foto_url ?? null}
      />
    </div>
  );
}
