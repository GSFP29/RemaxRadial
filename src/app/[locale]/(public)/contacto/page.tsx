import { getTranslations } from "next-intl/server";
import { FormularioContacto } from "@/components/formulario-contacto";
import { ContactosWidgets } from "@/components/contactos-widgets";
import { CtaVenderRecrutar } from "@/components/cta-vender-recrutar";
import { CenaBlobs } from "@/components/cena-blobs";

export default async function ContactoPage() {
  const t = await getTranslations("contact");

  return (
    <>
      <div className="relative w-full overflow-hidden bg-background py-16">
        <CenaBlobs />

        <div className="relative mx-auto w-full max-w-2xl px-6">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold sm:text-4xl">{t("title")}</h1>
            <p className="mt-2 text-foreground-secondary">{t("subtitle")}</p>
          </div>

          <div className="mb-10">
            <ContactosWidgets />
          </div>

          <FormularioContacto />
        </div>
      </div>

      <CtaVenderRecrutar />
    </>
  );
}
