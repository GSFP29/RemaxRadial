"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Phone } from "lucide-react";
import { AGENCIA, urlWhatsapp } from "@/lib/agencia";
import { IconeWhatsapp } from "@/components/icone-whatsapp";

// Botão "split" inspirado em ui.watermelon.sh/animated-components/split-button
// — expande na horizontal em CSS puro (truque grid-template-columns
// 0fr→1fr), sem biblioteca de animação. Sem mensagem pré-preenchida no
// WhatsApp: só faz sentido referenciar um imóvel na ficha do imóvel.
export function BotaoContacteNos({ className }: { className: string }) {
  const t = useTranslations("contacteBotao");
  const [aberto, setAberto] = useState(false);
  const [telefoneAberto, setTelefoneAberto] = useState(false);
  const urlWa = urlWhatsapp();

  if (!urlWa && !AGENCIA.telefone) {
    return (
      <Link href="/contacto" className={className}>
        {t("label")}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => {
          setAberto((v) => !v);
          setTelefoneAberto(false);
        }}
        className={className}
      >
        {t("label")}
      </button>

      <div
        className="grid overflow-hidden transition-[grid-template-columns] duration-300 ease-out"
        style={{ gridTemplateColumns: aberto ? "1fr" : "0fr" }}
      >
        <div className="flex min-w-0 items-center gap-3">
          {urlWa && (
            <a
              href={urlWa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-2 rounded-lg bg-[#25D366] px-6 py-4 text-sm font-bold whitespace-nowrap text-white shadow-lg shadow-[#25D366]/40 transition hover:-translate-y-0.5 hover:brightness-110"
            >
              <IconeWhatsapp size={18} /> {t("whatsapp")}
            </a>
          )}

          {AGENCIA.telefone && (
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setTelefoneAberto((v) => !v)}
                className="flex shrink-0 items-center gap-2 rounded-lg bg-brand-red px-6 py-4 text-sm font-bold whitespace-nowrap text-white shadow-lg shadow-brand-red/40 transition hover:-translate-y-0.5 hover:brightness-110"
              >
                <Phone size={16} /> {t("phone")}
              </button>

              <div
                className="grid overflow-hidden transition-[grid-template-columns] duration-300 ease-out"
                style={{ gridTemplateColumns: telefoneAberto ? "1fr" : "0fr" }}
              >
                <div className="min-w-0">
                  <a
                    href={`tel:${AGENCIA.telefone}`}
                    className="block shrink-0 rounded-lg border-2 border-brand-red px-6 py-4 text-base font-extrabold whitespace-nowrap text-brand-red"
                  >
                    {AGENCIA.telefone}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
