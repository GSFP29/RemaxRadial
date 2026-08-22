import Link from "next/link";
import { listarImoveisPorTipo } from "@/lib/imoveis";
import { PropriedadesDestaque } from "@/components/propriedades-destaque";

export default async function HomePage() {
  const [paraVenda, paraArrendar] = await Promise.all([
    listarImoveisPorTipo("venda"),
    listarImoveisPorTipo("arrendamento"),
  ]);

  return (
    <>
      <section
        className="relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url(/blob-hero.svg)" }}
      >
        <div className="relative flex flex-col items-center gap-6 px-6 py-28 text-center">
          {/* Símbolo da Radial — placeholder até termos o ficheiro real do
              logótipo (wordmark vermelho, sem círculo, "since 2003"). */}
          <div className="flex flex-col items-center">
            <span className="text-5xl font-extrabold tracking-tight text-brand-red sm:text-6xl">
              RADIAL
            </span>
            <span className="mt-1 text-xs font-semibold tracking-[0.3em] text-brand-blue">
              SINCE 2003
            </span>
          </div>

          <h1 className="max-w-2xl text-2xl font-bold sm:text-3xl">
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

      <PropriedadesDestaque />
    </>
  );
}
