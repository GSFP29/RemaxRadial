import { useTranslations } from "next-intl";
import { MessageCircle, Phone, User } from "lucide-react";
import { AGENCIA, urlWhatsapp } from "@/lib/agencia";
import { mensagemWhatsappImovel, type ImovelPublico } from "@/lib/imoveis";
import { IconeWhatsapp } from "@/components/icone-whatsapp";

export function ContactoImovel({ imovel }: { imovel: ImovelPublico }) {
  const t = useTranslations("propertyDetail");
  const consultorNome = imovel.dados_api?.userName;
  const consultorTelemovel = imovel.dados_api?.userCellPhone;
  const consultorEmail = imovel.dados_api?.userEmail;

  const mensagem = mensagemWhatsappImovel(imovel);
  const linkWhatsapp = urlWhatsapp(mensagem);

  if (!consultorNome && !AGENCIA.telefone && !linkWhatsapp) return null;

  return (
    <div className="mt-8 grid gap-4 border-t border-grid pt-8 sm:grid-cols-2">
      {consultorNome && (
        <div className="rounded-xl border border-brand-blue/30 bg-brand-blue/[0.03] p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
              <User size={18} />
            </div>
            <p className="text-sm font-semibold text-foreground-secondary">
              {t("contactAgent")}
            </p>
          </div>
          <p className="mb-3 text-lg font-bold">{consultorNome}</p>
          <div className="flex flex-col gap-2 text-sm">
            {consultorTelemovel && (
              <a
                href={`tel:${consultorTelemovel}`}
                className="inline-flex items-center gap-2 rounded-md bg-brand-blue px-4 py-2 font-semibold text-white transition hover:brightness-110"
              >
                <Phone size={15} /> {consultorTelemovel}
              </a>
            )}
            {consultorEmail && (
              <a href={`mailto:${consultorEmail}`} className="font-medium text-brand-blue">
                {consultorEmail}
              </a>
            )}
          </div>
        </div>
      )}

      {(AGENCIA.telefone || linkWhatsapp) && (
        <div className="rounded-xl border border-brand-red/30 bg-brand-red/[0.03] p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
              <MessageCircle size={18} />
            </div>
            <p className="text-sm font-semibold text-foreground-secondary">
              {t("contactAgency")}
            </p>
          </div>
          <p className="mb-3 text-lg font-bold">RE/MAX Radial</p>
          <div className="flex flex-col gap-2 text-sm">
            {linkWhatsapp && (
              <a
                href={linkWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2 font-semibold text-white transition hover:brightness-110"
              >
                <IconeWhatsapp size={15} /> {t("talkOnWhatsapp")}
              </a>
            )}
            {AGENCIA.telefone && (
              <a
                href={`tel:${AGENCIA.telefone}`}
                className="inline-flex items-center gap-2 rounded-md bg-brand-red px-4 py-2 font-semibold text-white transition hover:brightness-110"
              >
                <Phone size={15} /> {AGENCIA.telefone}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
