import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listarImoveisDestaque } from "@/lib/imoveis";
import { ImovelCard } from "@/components/imovel-card";

export async function PropriedadesDestaque() {
  const t = await getTranslations("home");
  const imoveis = await listarImoveisDestaque(6);

  if (imoveis.length === 0) return null;

  return (
    <section className="border-t border-grid px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              {t("featuredTitle")}
            </h2>
            <p className="mt-1 text-foreground-secondary">
              {t("featuredSubtitle")}
            </p>
          </div>
          <Link
            href="/comprar"
            className="rounded-full border border-grid px-4 py-2 text-sm font-medium hover:border-brand-blue hover:text-brand-blue"
          >
            {t("viewAll")}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {imoveis.map((imovel) => (
            <ImovelCard key={imovel.id} imovel={imovel} />
          ))}
        </div>
      </div>
    </section>
  );
}
