import { getTranslations } from "next-intl/server";
import { Phone } from "lucide-react";
import { AGENCIA, urlWhatsapp } from "@/lib/agencia";
import { IconeWhatsapp } from "@/components/icone-whatsapp";

// Barra fixa só em telemóvel — contacto sempre acessível durante o scroll,
// sem duplicar o botão "split" do cabeçalho (esse fica escondido em ecrãs
// pequenos por falta de espaço). Some sozinha se não houver WhatsApp/telefone.
export async function CtaFixaMovel() {
  const t = await getTranslations("contacteBotao");
  const urlWa = urlWhatsapp();

  if (!urlWa && !AGENCIA.telefone) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-grid bg-background sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {urlWa && (
        <a
          href={urlWa}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 bg-[#25D366] py-3 text-sm font-bold text-white"
        >
          <IconeWhatsapp size={18} /> {t("whatsapp")}
        </a>
      )}
      {AGENCIA.telefone && (
        <a
          href={`tel:${AGENCIA.telefone}`}
          className="flex flex-1 items-center justify-center gap-2 bg-brand-red py-3 text-sm font-bold text-white"
        >
          <Phone size={16} /> {t("phone")}
        </a>
      )}
    </div>
  );
}
