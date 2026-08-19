import Link from "next/link";
import { formatarPreco, imagemUrl, type ImovelPublico } from "@/lib/imoveis";

export function ImovelCard({ imovel }: { imovel: ImovelPublico }) {
  const foto = imovel.dados_api?.listingPictures?.[0];
  const corSelo = imovel.tipo === "venda" ? "bg-brand-blue" : "bg-brand-red";

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
            alt=""
            className="h-full w-full object-cover transition group-hover:opacity-90"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-foreground-secondary">
            Sem fotografia
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full ${corSelo} px-3 py-1 text-xs font-semibold text-white shadow-sm`}
        >
          {imovel.tipo === "venda" ? "Venda" : "Arrendamento"}
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
      </div>
    </Link>
  );
}
