import { useTranslations } from "next-intl";

export function CtaMaxFinance() {
  const t = useTranslations("maxfinance");

  return (
    <section className="border-t border-grid px-6 py-14">
      <a
        href="https://maxfinancedelta.com"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative mx-auto block aspect-[21/9] max-w-4xl overflow-hidden rounded-xl shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:aspect-[3/1]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cartoes/maxfinance.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        <div
          className="absolute top-0 left-0 h-16 w-32 bg-brand-blue"
          style={{ clipPath: "polygon(0 0, 100% 0, 40% 100%, 0 100%)" }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
          <div>
            <p className="text-xs font-extrabold tracking-widest text-white uppercase">
              {t("eyebrow")}
            </p>
            <p className="mt-1 text-lg font-bold text-white drop-shadow-sm sm:text-xl">
              {t("title")}
            </p>
            <p className="mt-1 max-w-md text-sm text-white/90">
              {t("description")}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold whitespace-nowrap text-brand-blue">
            {t("learnMore")}
          </span>
        </div>
      </a>
    </section>
  );
}
