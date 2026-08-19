import Link from "next/link";
import { listarImoveisPorTipo } from "@/lib/imoveis";

export default async function HomePage() {
  const [paraVenda, paraArrendar] = await Promise.all([
    listarImoveisPorTipo("venda"),
    listarImoveisPorTipo("arrendamento"),
  ]);

  return (
    <>
      <section className="relative overflow-hidden">
        {/* Formas decorativas suaves — só estilo, sem informação */}
        <div
          aria-hidden
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-blue/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-brand-red/10 blur-3xl"
        />

        <div className="relative flex flex-col items-center gap-4 px-6 py-24 text-center">
          <span className="rounded-full border border-brand-blue/20 bg-brand-blue/5 px-4 py-1 text-sm font-semibold tracking-wide text-brand-blue">
            RE/MAX Radial · Odivelas
          </span>
          <h1 className="max-w-2xl text-4xl font-bold sm:text-5xl">
            22 anos a vender e arrendar em Odivelas e concelhos vizinhos
          </h1>
          <p className="max-w-xl text-foreground-secondary">
            Agência 12116 da rede RE/MAX. Conheça a nossa carteira atual de
            imóveis para venda e arrendamento.
          </p>
          <div className="mt-2 flex gap-3">
            <Link
              href="/comprar"
              className="rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-red/30 transition hover:brightness-110"
            >
              Comprar
            </Link>
            <Link
              href="/arrendar"
              className="rounded-md bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-blue/30 transition hover:brightness-110"
            >
              Arrendar
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-grid px-6 py-12">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-6">
          {[
            { valor: "22", rotulo: "anos de atividade", cor: "bg-brand-blue" },
            { valor: String(paraVenda.length), rotulo: "imóveis para venda", cor: "bg-brand-red" },
            { valor: String(paraArrendar.length), rotulo: "imóveis para arrendar", cor: "bg-brand-blue" },
          ].map((stat) => (
            <div key={stat.rotulo} className="flex flex-col items-center gap-3 text-center">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${stat.cor} text-lg font-bold text-white`}
              >
                {stat.valor}
              </div>
              <span className="text-sm text-foreground-secondary">{stat.rotulo}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
