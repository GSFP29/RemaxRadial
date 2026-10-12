import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatarPreco, imagemUrl, type ImovelPublico } from "@/lib/imoveis";

export function ImovelCard({ imovel }: { imovel: ImovelPublico }) {
  const t = useTranslations("propertyCard");
  const foto = imovel.dados_api?.listingPictures?.[0];
  const corSelo = imovel.tipo === "venda" ? "bg-brand-blue" : "bg-brand-red";

  // Só as estatísticas que o imóvel realmente tem (ex.: armazéns e lojas
  // não têm "quartos") — nunca reservar espaço para uma coluna vazia, que
  // é o que deixava o layout desalinhado nesses casos.
  const estatisticas = [
    imovel.quartos !== null && `${imovel.quartos} ${t("bedrooms")}`,
    imovel.casas_banho !== null && `${imovel.casas_banho} ${t("bathrooms")}`,
    imovel.area_m2 !== null && `${imovel.area_m2} m²`,
  ].filter(Boolean) as string[];

  return (
    <Link
      href={`/imoveis/${imovel.ref_remax}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-grid transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full bg-grid">
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagemUrl(foto, "l-feat")}
            alt={[imovel.tipo_imovel, imovel.tipologia, imovel.freguesia ?? imovel.concelho]
              .filter(Boolean)
              .join(" · ")}
            // absolute + inset-0, não h-full/w-full em fluxo normal — dentro
            // de um cartão flex-col, uma imagem em fluxo normal podia
            // impor a SUA própria proporção (ex.: fotos em retrato) à
            // caixa "aspect-[4/3]", desalinhando a fila toda de cartões.
            // Fora do fluxo, a imagem nunca pode influenciar o tamanho do
            // pai — a caixa mantém sempre 4:3, seja qual for a foto.
            className="absolute inset-0 h-full w-full object-cover transition group-hover:opacity-90"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-foreground-secondary">
            {t("noPhoto")}
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full ${corSelo} px-3 py-1 text-xs font-semibold text-white shadow-sm`}
        >
          {imovel.tipo === "venda" ? t("sale") : t("rent")}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {imovel.tipo_imovel && (
          <span className="text-xs font-semibold tracking-wide text-foreground-secondary uppercase">
            {imovel.tipo_imovel}
          </span>
        )}
        <span className="text-lg font-bold">
          {formatarPreco(imovel.preco_pedido)}
        </span>
        <span className="text-sm text-foreground-secondary">
          {[imovel.tipologia, imovel.freguesia].filter(Boolean).join(" · ")}
        </span>

        {estatisticas.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 border-t border-grid pt-2 text-xs text-foreground-secondary">
            {estatisticas.map((texto) => (
              <span key={texto}>{texto}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
