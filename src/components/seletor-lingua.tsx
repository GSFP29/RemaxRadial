"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

// Bandeira + nome nativo de cada língua — a bandeira funciona como o
// próprio rótulo do botão principal (PT por omissão), pedido explícito do
// cliente para não ocupar mais espaço que o botão de tema.
const LINGUAS: Record<Locale, { bandeira: string; nome: string }> = {
  pt: { bandeira: "🇵🇹", nome: "Português" },
  en: { bandeira: "🇬🇧", nome: "English" },
  fr: { bandeira: "🇫🇷", nome: "Français" },
  es: { bandeira: "🇪🇸", nome: "Español" },
  de: { bandeira: "🇩🇪", nome: "Deutsch" },
  hi: { bandeira: "🇮🇳", nome: "हिन्दी" },
  zh: { bandeira: "🇨🇳", nome: "中文" },
};

export function SeletorLingua({ className = "" }: { className?: string }) {
  const localeAtual = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function aoClicarFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, []);

  function escolher(locale: Locale) {
    setAberto(false);
    router.replace(pathname, { locale });
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-label="Mudar de língua"
        aria-expanded={aberto}
        title={LINGUAS[localeAtual].nome}
        className="flex h-8 min-w-8 items-center justify-center rounded-full border border-grid px-1.5 text-sm transition hover:border-brand-blue"
      >
        <span aria-hidden>{LINGUAS[localeAtual].bandeira}</span>
      </button>

      {aberto && (
        <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-grid bg-background py-1 shadow-md">
          {routing.locales.map((locale) => (
            <button
              key={locale}
              type="button"
              onClick={() => escolher(locale)}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition hover:bg-grid/60 ${
                locale === localeAtual ? "font-semibold text-brand-blue" : "text-foreground"
              }`}
            >
              <span aria-hidden>{LINGUAS[locale].bandeira}</span>
              <span>{LINGUAS[locale].nome}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
