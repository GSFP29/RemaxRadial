import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { obterProjeto } from "@/lib/projetos";
import { PlantaInterativa } from "@/components/planta-interativa";

export default async function VerProjetoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projeto = await obterProjeto(id);
  if (!projeto) notFound();
  const t = await getTranslations("project");

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold">{projeto.titulo}</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        {t("instructions")}
      </p>
      <PlantaInterativa projeto={projeto} />
    </div>
  );
}
