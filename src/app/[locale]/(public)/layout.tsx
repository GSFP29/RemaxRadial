import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { AlternarTema } from "@/components/alternar-tema";
import { SeletorLingua } from "@/components/seletor-lingua";
import { SchemaNegocioLocal } from "@/components/schema-negocio-local";
import { CtaFixaMovel } from "@/components/cta-fixa-movel";
import { Link } from "@/i18n/navigation";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const t = await getTranslations();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SchemaNegocioLocal />
      {/* Barra de destaque com as cores da marca — sempre presente, discreta */}
      <div className="flex h-1.5">
        <div className="flex-1 bg-brand-red" />
        <div className="flex-1 bg-brand-blue" />
      </div>

      <header className="border-b border-grid px-6 py-3">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Link href="/" className="justify-self-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-radial.png" alt="RE/MAX Radial" className="h-9 w-auto" />
          </Link>

          <nav className="flex items-center gap-4 justify-self-center text-sm font-medium">
            <Link href="/comprar" className="hover:text-brand-blue">
              {t("nav.buy")}
            </Link>
            <span aria-hidden className="h-3.5 w-0.5 rounded-full bg-brand-blue/30" />
            <Link href="/arrendar" className="hover:text-brand-blue">
              {t("nav.rent")}
            </Link>
            <span aria-hidden className="h-3.5 w-0.5 rounded-full bg-brand-blue/30" />
            <Link href="/vender" className="hover:text-brand-blue">
              {t("nav.sell")}
            </Link>
          </nav>

          <div className="flex items-center gap-3 justify-self-end">
            {/* /painel não é traduzido nem faz parte do routing do
                next-intl — link normal, nunca prefixado com a língua. */}
            {user && (
              <NextLink
                href="/painel"
                className="hidden rounded-full bg-brand-blue/10 px-3 py-1.5 text-sm text-brand-blue hover:bg-brand-blue/20 sm:inline-block"
              >
                {t("nav.panel")}
              </NextLink>
            )}
            <Link
              href="/contacto"
              className="rounded-full bg-brand-blue px-4 py-1.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              {t("nav.contact")}
            </Link>
            <AlternarTema />
            <SeletorLingua />
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      <CtaFixaMovel />

      <footer className="bg-brand-blue px-6 py-10 pb-16 text-sm text-white sm:pb-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="text-lg font-bold">RE/MAX Radial</span>
            <p className="mt-1 text-white/80">{t("footer.agency")}</p>
          </div>
          <nav className="flex flex-col gap-2 sm:items-end">
            <Link href="/privacidade" className="text-white/90 hover:text-white hover:underline">
              {t("footer.privacy")}
            </Link>
            <Link href="/termos" className="text-white/90 hover:text-white hover:underline">
              {t("footer.terms")}
            </Link>
          </nav>
        </div>
        <div className="mx-auto mt-8 max-w-5xl border-t border-white/20 pt-4 text-xs text-white/70">
          {t("footer.rights", { ano: new Date().getFullYear() })}
        </div>
      </footer>
    </div>
  );
}
