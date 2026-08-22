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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-radial.png"
            alt="RE/MAX Radial — since 2003"
            className="w-full max-w-xl"
          />

          <h1 className="max-w-2xl text-2xl font-bold sm:text-3xl">
            22 anos a abrir portas para novas histórias
          </h1>
          <p className="max-w-xl text-foreground-secondary">
            Experiência, proximidade e conhecimento local para tornar cada
            mudança mais simples.
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
