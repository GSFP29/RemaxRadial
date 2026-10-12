import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CenaBlobs } from "@/components/cena-blobs";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="relative mx-auto flex w-full flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      <CenaBlobs />
      <div className="relative mx-auto w-full max-w-lg">
        <p className="text-6xl font-bold text-brand-blue">404</p>
        <h1 className="mt-4 text-2xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-foreground-secondary">{t("body")}</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
