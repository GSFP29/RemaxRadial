import Link from "next/link";
import { listarImoveisAtivos } from "@/lib/imoveis";

export default async function HomePage() {
  const imoveis = await listarImoveisAtivos();
  const paraVenda = imoveis.filter((i) => i.tipo === "venda").length;
  const paraArrendar = imoveis.filter((i) => i.tipo === "arrendamento").length;

  return (
    <>
      <section className="flex flex-col items-center gap-4 px-6 py-20 text-center">
        <span className="text-sm font-semibold tracking-wide text-brand-blue uppercase">
          RE/MAX Radial · Odivelas
        </span>
        <h1 className="max-w-2xl text-3xl font-bold sm:text-4xl">
          22 anos a vender e arrendar em Odivelas e concelhos vizinhos
        </h1>
        <p className="max-w-xl text-foreground-secondary">
          Agência 12116 da rede RE/MAX. Conheça a nossa carteira atual de
          imóveis para venda e arrendamento.
        </p>
        <Link
          href="/imoveis"
          className="mt-2 rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white"
        >
          Ver imóveis disponíveis
        </Link>
      </section>

      <section className="border-t border-grid px-6 py-10">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-brand-blue">22</div>
            <div className="text-sm text-foreground-secondary">anos de atividade</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brand-blue">{paraVenda}</div>
            <div className="text-sm text-foreground-secondary">imóveis para venda</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brand-blue">{paraArrendar}</div>
            <div className="text-sm text-foreground-secondary">imóveis para arrendar</div>
          </div>
        </div>
      </section>
    </>
  );
}
