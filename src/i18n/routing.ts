import { defineRouting } from "next-intl/routing";

// Só o site público é traduzido — o painel interno (consultores/admin)
// fica só em português, ver CLAUDE.md secção 12. Por isso o middleware
// (middleware.ts) só corre nas rotas públicas.
export const routing = defineRouting({
  locales: ["pt", "en", "fr", "es", "de", "hi", "zh"],
  defaultLocale: "pt",
  // "as-needed": português sem prefixo (/comprar), as outras línguas com
  // prefixo (/en/comprar) — URLs limpas na língua principal do negócio.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
