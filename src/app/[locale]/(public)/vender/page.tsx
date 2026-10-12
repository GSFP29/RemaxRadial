import { getTranslations } from "next-intl/server";
import { FormularioVender } from "@/components/formulario-vender";
import { CtaVenderRecrutar } from "@/components/cta-vender-recrutar";
import { CenaBlobs } from "@/components/cena-blobs";

export default async function VenderPage() {
  const t = await getTranslations("sell");

  return (
    <>
      <div className="relative w-full overflow-hidden bg-background py-16">
        <CenaBlobs />

        <div className="relative mx-auto w-full max-w-2xl px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="mt-2 text-foreground-secondary">{t("subtitle")}</p>
          </div>

          <FormularioVender />
        </div>
      </div>

      <CtaVenderRecrutar />
    </>
  );
}
