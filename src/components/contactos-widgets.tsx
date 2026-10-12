import { useTranslations } from "next-intl";
import { MapPin, Phone } from "lucide-react";
import { AGENCIA, urlWhatsapp } from "@/lib/agencia";
import { IconeWhatsapp } from "@/components/icone-whatsapp";

// Inspirado em registry.watermelon.sh/r/contact-5 — três blocos com ícone
// em destaque. Só mostra os que temos dados reais para preencher (nunca
// inventar morada exata, só a zona já confirmada).
export function ContactosWidgets() {
  const t = useTranslations("contact");
  const urlWa = urlWhatsapp();

  const widgets = [
    urlWa && {
      icone: IconeWhatsapp,
      titulo: t("whatsappTitle"),
      descricao: t("whatsappDescription"),
      valor: t("whatsappCta"),
      href: urlWa,
      externo: true,
    },
    AGENCIA.telefone && {
      icone: Phone,
      titulo: t("phoneTitle"),
      descricao: t("phoneDescription"),
      valor: AGENCIA.telefone,
      href: `tel:${AGENCIA.telefone}`,
      externo: false,
    },
    AGENCIA.morada && {
      icone: MapPin,
      titulo: t("officeTitle"),
      descricao: t("officeDescription"),
      valor: AGENCIA.morada,
      href: AGENCIA.urlMapa,
      externo: true,
    },
  ].filter(Boolean) as {
    icone: React.ComponentType<{ size?: number }>;
    titulo: string;
    descricao: string;
    valor: string;
    href: string | null;
    externo: boolean;
  }[];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {widgets.map((w) => {
        const Icone = w.icone;
        const conteudo = (
          <>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <Icone size={20} />
            </div>
            <p className="mt-3 text-sm font-semibold">{w.titulo}</p>
            <p className="mt-1 text-xs text-foreground-secondary">{w.descricao}</p>
            <p className="mt-3 text-sm font-semibold text-brand-blue">{w.valor}</p>
          </>
        );

        const className =
          "rounded-xl border border-grid bg-background p-5 text-center transition hover:-translate-y-0.5 hover:shadow-sm flex flex-col items-center";

        if (!w.href) {
          return (
            <div key={w.titulo} className={className}>
              {conteudo}
            </div>
          );
        }

        return (
          <a
            key={w.titulo}
            href={w.href}
            target={w.externo ? "_blank" : undefined}
            rel={w.externo ? "noopener noreferrer" : undefined}
            className={className}
          >
            {conteudo}
          </a>
        );
      })}
    </div>
  );
}
