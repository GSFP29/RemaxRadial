import { getTranslations } from "next-intl/server";
import { FormularioRecrutamento } from "@/components/formulario-recrutamento";

export default async function JuntarEquipaPage() {
  const t = await getTranslations("recruit");

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-foreground-secondary">{t("subtitle")}</p>
      </div>

      <FormularioRecrutamento />
    </div>
  );
}
