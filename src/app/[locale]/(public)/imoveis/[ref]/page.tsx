import Link from "next/link";
import { notFound } from "next/navigation";
import {
  comodidadesImovel,
  formatarPreco,
  obterImovelPorRef,
  urlAnuncioRemax,
} from "@/lib/imoveis";
import { LocalizacaoImovel } from "@/components/localizacao-imovel";
import { GaleriaFotos } from "@/components/galeria-fotos";

export default async function ImovelPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const imovel = await obterImovelPorRef(ref);

  if (!imovel) notFound();

  const fotos = imovel.dados_api?.listingPictures ?? [];
  const consultorNome = imovel.dados_api?.userName;
  const consultorTelemovel = imovel.dados_api?.userCellPhone;
  const consultorEmail = imovel.dados_api?.userEmail;
  const comodidades = comodidadesImovel(imovel);

  const corSelo = imovel.tipo === "venda" ? "bg-brand-blue" : "bg-brand-red";

  const estatisticas = [
    imovel.quartos !== null && [`${imovel.quartos}`, "Quartos"],
    imovel.casas_banho !== null && [`${imovel.casas_banho}`, "Casas de banho"],
    imovel.area_m2 !== null && [`${imovel.area_m2} m²`, "Área total"],
    imovel.tipo_imovel && [imovel.tipo_imovel, "Tipo de imóvel"],
  ].filter(Boolean) as [string, string][];

  const detalhes = [
    imovel.tipologia && ["Tipologia", imovel.tipologia],
    imovel.ano_construcao && ["Ano de construção", String(imovel.ano_construcao)],
    imovel.certificado_energetico && [
      "Certificado energético",
      imovel.certificado_energetico,
    ],
  ].filter(Boolean) as [string, string][];

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      <Link href="/imoveis" className="mb-6 inline-block text-sm text-brand-blue">
        ← Voltar aos imóveis
      </Link>

      <GaleriaFotos fotos={fotos} />

      <div className="flex items-center gap-2">
        <span
          className={`rounded-full ${corSelo} px-3 py-1 text-xs font-semibold text-white`}
        >
          {imovel.tipo === "venda" ? "Venda" : "Arrendamento"}
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
          Ver anúncio no site RE/MAX →
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

      {detalhes.length > 0 && (
        <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-grid pt-8 sm:grid-cols-3">
          {detalhes.map(([rotulo, valor]) => (
            <div key={rotulo}>
              <dt className="text-xs text-foreground-secondary">{rotulo}</dt>
              <dd className="font-medium">{valor}</dd>
            </div>
          ))}
        </dl>
      )}

      {comodidades.length > 0 && (
        <div className="mt-8 border-t border-grid pt-8">
          <h2 className="mb-3 text-sm font-semibold text-foreground-secondary">
            Comodidades
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

      {consultorNome && (
        <div className="mt-8 rounded-lg border border-brand-blue/30 bg-brand-blue/[0.03] p-5">
          <p className="mb-1 text-sm font-semibold text-foreground-secondary">
            Contactar o Consultor
          </p>
          <p className="text-lg font-bold">{consultorNome}</p>
          <div className="mt-2 flex flex-col gap-1 text-sm sm:flex-row sm:gap-4">
            {consultorTelemovel && (
              <a href={`tel:${consultorTelemovel}`} className="font-medium text-brand-blue">
                {consultorTelemovel}
              </a>
            )}
            {consultorEmail && (
              <a href={`mailto:${consultorEmail}`} className="font-medium text-brand-blue">
                {consultorEmail}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
