import { getTranslations } from "next-intl/server";
import { Home, KeyRound, Tag } from "lucide-react";
import { listarImoveisPorTipo } from "@/lib/imoveis";
import { PropriedadesDestaque } from "@/components/propriedades-destaque";
import { SplashEntrada } from "@/components/splash-entrada";
import { CtaVenderRecrutar } from "@/components/cta-vender-recrutar";
import { CtaMaxFinance } from "@/components/cta-maxfinance";
import { AvaliacoesGoogle } from "@/components/avaliacoes-google";
import { BotaoContacteNos } from "@/components/botao-contacte-nos";
import { Faqs } from "@/components/faqs";
import { Link } from "@/i18n/navigation";

export default async function HomePage() {
  const t = await getTranslations("home");
  const [paraVenda, paraArrendar] = await Promise.all([
    listarImoveisPorTipo("venda"),
    listarImoveisPorTipo("arrendamento"),
  ]);

  return (
    <>
      <SplashEntrada />

      <section
        className="relative overflow-hidden bg-background bg-cover bg-center"
        style={{ backgroundImage: "url(/blob-hero.svg)" }}
      >
        <div className="relative flex flex-col items-center gap-6 px-6 py-28 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-radial.png"
            alt="RE/MAX Radial — since 2003"
            className="w-full max-w-xl"
          />

          <h1 className="max-w-2xl text-2xl font-bold sm:text-3xl">
            {t("heroTitle")}
          </h1>
          <p className="max-w-xl text-foreground-secondary">
            {t("heroSubtitle")}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/comprar"
              className="flex items-center gap-2 rounded-full bg-brand-red px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand-red/30 transition hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-xl hover:shadow-brand-red/40"
            >
              <Home size={18} strokeWidth={2.5} /> {t("buy")}
            </Link>
            <Link
              href="/arrendar"
              className="flex items-center gap-2 rounded-full bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand-blue/30 transition hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-xl hover:shadow-brand-blue/40"
            >
              <KeyRound size={18} strokeWidth={2.5} /> {t("rent")}
            </Link>
            <Link
              href="/vender"
              className="flex items-center gap-2 rounded-full bg-brand-red px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand-red/30 transition hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-xl hover:shadow-brand-red/40"
            >
              <Tag size={18} strokeWidth={2.5} /> {t("sell")}
            </Link>
            <BotaoContacteNos className="flex items-center gap-2 rounded-full bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand-blue/30 transition hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-xl hover:shadow-brand-blue/40" />
          </div>
        </div>
      </section>

      <section className="border-t border-grid px-6 py-12">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-6">
          {[
            { valor: "22", rotulo: t("statsYears"), cor: "bg-brand-blue" },
            { valor: String(paraVenda.length), rotulo: t("statsForSale"), cor: "bg-brand-red" },
            { valor: String(paraArrendar.length), rotulo: t("statsForRent"), cor: "bg-brand-blue" },
          ].map((stat) => (
            <div key={stat.rotulo} className="flex flex-col items-center gap-3 text-center">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${stat.cor} text-lg font-bold text-white`}
              >
                {stat.valor}
              </div>
              <span className="text-sm text-foreground-secondary">{stat.rotulo}</span>
            </div>
          ))}
        </div>
      </section>

      <PropriedadesDestaque />
      <CtaVenderRecrutar />
      <CtaMaxFinance />
      <AvaliacoesGoogle />
      <Faqs />
    </>
  );
}
