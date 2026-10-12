import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  comodidadesImovel,
  formatarPreco,
  imagemUrl,
  obterImovelPorRef,
  urlAnuncioRemax,
} from "@/lib/imoveis";
import { LocalizacaoImovel } from "@/components/localizacao-imovel";
import { GaleriaFotos } from "@/components/galeria-fotos";
import { ContactoImovel } from "@/components/contacto-imovel";
import { SimuladorFinanciamento } from "@/components/simulador-financiamento";

function descricaoImovel(imovel: NonNullable<Awaited<ReturnType<typeof obterImovelPorRef>>>) {
  return [imovel.tipo_imovel, imovel.tipologia, imovel.freguesia ?? imovel.concelho]
    .filter(Boolean)
    .join(" · ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ref: string }>;
}): Promise<Metadata> {
  const { ref } = await params;
  const imovel = await obterImovelPorRef(ref);
  if (!imovel) return {};

  const titulo = `${descricaoImovel(imovel)} — ${formatarPreco(imovel.preco_pedido)}`;
  const foto = imovel.dados_api?.listingPictures?.[0];

  return {
    title: titulo,
    description: `${titulo} · RE/MAX Radial, agência 12116, Odivelas.`,
    openGraph: foto
      ? { images: [{ url: imagemUrl(foto, "l-feat") }] }
      : undefined,
  };
}

export default async function ImovelPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const imovel = await obterImovelPorRef(ref);

  if (!imovel) notFound();

  const t = await getTranslations("propertyDetail");
  const tCard = await getTranslations("propertyCard");
  const fotos = imovel.dados_api?.listingPictures ?? [];
  const comodidades = comodidadesImovel(imovel);

  const corSelo = imovel.tipo === "venda" ? "bg-brand-blue" : "bg-brand-red";

  const estatisticas = [
    imovel.quartos !== null && [`${imovel.quartos}`, t("bedrooms")],
    imovel.casas_banho !== null && [`${imovel.casas_banho}`, t("bathrooms")],
    imovel.area_m2 !== null && [`${imovel.area_m2} m²`, t("totalArea")],
    imovel.tipo_imovel && [imovel.tipo_imovel, t("propertyType")],
  ].filter(Boolean) as [string, string][];

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <Link href="/imoveis" className="mb-6 inline-block text-sm text-brand-blue">
        {t("back")}
      </Link>

      <GaleriaFotos fotos={fotos} descricao={descricaoImovel(imovel)} />

      <div className="flex items-center gap-2">
        <span
          className={`rounded-full ${corSelo} px-3 py-1 text-xs font-semibold text-white`}
        >
          {imovel.tipo === "venda" ? tCard("sale") : tCard("rent")}
        </span>
        {imovel.tipo_imovel && (
          <span className="text-sm font-semibold tracking-wide text-foreground-secondary uppercase">
            {imovel.tipo_imovel}
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="mt-3 text-3xl font-bold">
          {formatarPreco(imovel.preco_pedido)}
        </h1>
        <a
          href={urlAnuncioRemax(imovel)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-brand-blue"
        >
          {t("viewOnRemax")}
        </a>
      </div>
      <p className="mt-1 text-foreground-secondary">
        {[imovel.freguesia, imovel.concelho].filter(Boolean).join(", ")}
      </p>

      {estatisticas.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-grid p-4 sm:grid-cols-4">
          {estatisticas.map(([valor, rotulo]) => (
            <div key={rotulo} className="text-center">
              <div className="text-lg font-bold text-brand-blue">{valor}</div>
              <div className="text-xs text-foreground-secondary">{rotulo}</div>
            </div>
          ))}
        </div>
      )}

      <LocalizacaoImovel imovel={imovel} />

      {comodidades.length > 0 && (
        <div className="mt-8 border-t border-grid pt-8">
          <h2 className="mb-3 text-sm font-semibold text-foreground-secondary">
            {t("amenities")}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {comodidades.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <span className="text-brand-blue">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {imovel.tipo === "venda" && (
        <SimuladorFinanciamento imovelId={imovel.id} precoPedido={imovel.preco_pedido} />
      )}

      <ContactoImovel imovel={imovel} />
    </div>
  );
}
