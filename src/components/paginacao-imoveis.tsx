import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  baseHref: string;
  filtros: Record<string, string | undefined>;
  paginaAtual: number;
  totalPaginas: number;
};

// Navegação circular: no fim volta ao início, no início volta ao fim —
// pedido explícito do cliente, referência ui.watermelon.sh continuous-pagination.
export function PaginacaoImoveis({ baseHref, filtros, paginaAtual, totalPaginas }: Props) {
  const t = useTranslations("pagination");
  if (totalPaginas <= 1) return null;

  function href(pagina: number) {
    const params = new URLSearchParams();
    for (const [chave, valor] of Object.entries(filtros)) {
      if (valor) params.set(chave, valor);
    }
    if (pagina > 1) params.set("pagina", String(pagina));
    const qs = params.toString();
    return qs ? `${baseHref}?${qs}` : baseHref;
  }

  const anterior = paginaAtual === 1 ? totalPaginas : paginaAtual - 1;
  const seguinte = paginaAtual === totalPaginas ? 1 : paginaAtual + 1;

  return (
    <nav
      aria-label={t("nav")}
      className="mt-8 flex items-center justify-center gap-1"
    >
      <Link
        href={href(anterior)}
        aria-label={t("previous")}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-grid text-foreground-secondary transition hover:border-brand-blue hover:text-brand-blue"
      >
        <ChevronLeft size={16} />
      </Link>

      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
        <Link
          key={pagina}
          href={href(pagina)}
          aria-current={pagina === paginaAtual ? "page" : undefined}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition ${
            pagina === paginaAtual
              ? "bg-brand-blue text-white"
              : "text-foreground-secondary hover:bg-brand-blue/10 hover:text-brand-blue"
          }`}
        >
          {pagina}
        </Link>
      ))}

      <Link
        href={href(seguinte)}
        aria-label={t("next")}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-grid text-foreground-secondary transition hover:border-brand-blue hover:text-brand-blue"
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  );
}
