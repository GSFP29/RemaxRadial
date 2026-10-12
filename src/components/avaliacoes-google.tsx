import { getTranslations } from "next-intl/server";
import { listarAvaliacoes5Estrelas } from "@/lib/avaliacoes";
import { CarrosselAvaliacoes } from "@/components/carrossel-avaliacoes";

export async function AvaliacoesGoogle() {
  const t = await getTranslations("home");
  const avaliacoes = await listarAvaliacoes5Estrelas();
  if (avaliacoes.length === 0) return null;

  return (
    <section className="border-t border-grid bg-brand-blue/[0.03] px-6 py-14">
      <h2 className="mb-8 text-center text-2xl font-bold">
        {t("reviewsTitle")}
      </h2>
      <CarrosselAvaliacoes avaliacoes={avaliacoes} />
    </section>
  );
}
