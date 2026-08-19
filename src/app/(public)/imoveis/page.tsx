import { listarImoveisAtivos } from "@/lib/imoveis";
import { ImovelCard } from "@/components/imovel-card";

export default async function ImoveisPage() {
  const imoveis = await listarImoveisAtivos();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold">Imóveis</h1>
      <p className="mb-8 text-sm text-foreground-secondary">
        {imoveis.length}{" "}
        {imoveis.length === 1 ? "imóvel disponível" : "imóveis disponíveis"}
      </p>

      {imoveis.length === 0 ? (
        <p className="text-foreground-secondary">
          Não há imóveis disponíveis neste momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {imoveis.map((imovel) => (
            <ImovelCard key={imovel.id} imovel={imovel} />
          ))}
        </div>
      )}
    </div>
  );
}
