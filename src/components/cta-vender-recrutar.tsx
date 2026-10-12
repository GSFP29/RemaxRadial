import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function CtaVenderRecrutar() {
  const t = useTranslations("ctaCards");

  return (
    <section className="border-t border-grid px-6 py-14">
      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
        <CartaoCta
          href="/vender"
          cor="red"
          imagem="/cartoes/vender.webp"
          titulo={t("sellTitle")}
          descricao={t("sellDescription")}
          saibaMais={t("learnMore")}
        />
        <CartaoCta
          href="/juntar-equipa"
          cor="blue"
          imagem="/cartoes/equipa.webp"
          titulo={t("joinTitle")}
          descricao={t("joinDescription")}
          saibaMais={t("learnMore")}
        />
      </div>
    </section>
  );
}

function CartaoCta({
  href,
  cor,
  imagem,
  titulo,
  descricao,
  saibaMais,
}: {
  href: string;
  cor: "red" | "blue";
  imagem: string;
  titulo: string;
  descricao: string;
  saibaMais: string;
}) {
  const corAcento = cor === "red" ? "bg-brand-red" : "bg-brand-blue";
  const corTexto = cor === "red" ? "text-brand-red" : "text-brand-blue";

  return (
    <Link
      href={href}
      className="group relative block aspect-[16/10] overflow-hidden rounded-xl shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagem}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />

      {/* Acento diagonal no canto, nas cores da marca */}
      <div
        className={`absolute top-0 left-0 h-20 w-40 ${corAcento}`}
        style={{ clipPath: "polygon(0 0, 100% 0, 40% 100%, 0 100%)" }}
      />

      {/* Gradiente para legibilidade do texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
        <div>
          <h3 className="text-xl font-bold text-white drop-shadow-sm">{titulo}</h3>
          <p className="mt-1 max-w-xs text-sm text-white/90">{descricao}</p>
        </div>
        <span
          className={`shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold whitespace-nowrap ${corTexto}`}
        >
          {saibaMais}
        </span>
      </div>
    </Link>
  );
}
