import Link from "next/link";
import { notFound } from "next/navigation";
import { formatarPreco, imagemUrl, obterImovelPorRef } from "@/lib/imoveis";

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

  const corSelo = imovel.tipo === "venda" ? "bg-brand-blue" : "bg-brand-red";

  const detalhes = [
    imovel.tipologia && ["Tipologia", imovel.tipologia],
    imovel.area_m2 && ["Área", `${imovel.area_m2} m²`],
    imovel.quartos !== null && ["Quartos", String(imovel.quartos)],
    imovel.casas_banho !== null && ["Casas de banho", String(imovel.casas_banho)],
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

      {fotos.length > 0 && (
        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {fotos.slice(0, 8).map((foto) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={foto}
              src={imagemUrl(foto, "ds-l")}
              alt=""
              className="aspect-[4/3] w-full rounded-md object-cover"
            />
          ))}
        </div>
      )}

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
      <h1 className="mt-3 text-3xl font-bold">
        {formatarPreco(imovel.preco_pedido)}
      </h1>
      <p className="mt-1 text-foreground-secondary">
        {[imovel.morada, imovel.freguesia, imovel.concelho]
          .filter(Boolean)
          .join(", ")}
      </p>

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

      {consultorNome && (
        <div className="mt-8 rounded-lg border border-grid p-4">
          <p className="text-sm text-foreground-secondary">Consultor responsável</p>
          <p className="font-semibold">{consultorNome}</p>
          {consultorTelemovel && (
            <a href={`tel:${consultorTelemovel}`} className="text-brand-blue">
              {consultorTelemovel}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
