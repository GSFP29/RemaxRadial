import {
  listarImoveisPorTipo,
  obterOpcoesFiltro,
  type TipoNegocio,
} from "@/lib/imoveis";
import { FiltrosImoveis } from "@/components/filtros-imoveis";
import { ImovelCard } from "@/components/imovel-card";

type Props = {
  tipo: TipoNegocio;
  titulo: string;
  actionFiltros: string;
  searchParams: { tipologia?: string; zona?: string; consultor?: string };
};

export async function ListagemImoveis({
  tipo,
  titulo,
  actionFiltros,
  searchParams,
}: Props) {
  const filtros = {
    tipologia: searchParams.tipologia,
    freguesia: searchParams.zona,
    consultor: searchParams.consultor,
  };

  const [imoveis, opcoes] = await Promise.all([
    listarImoveisPorTipo(tipo, filtros),
    obterOpcoesFiltro(tipo),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold">{titulo}</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        {imoveis.length}{" "}
        {imoveis.length === 1 ? "imóvel disponível" : "imóveis disponíveis"}
      </p>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="md:w-64 md:shrink-0">
          <div className="md:sticky md:top-6">
            <FiltrosImoveis
              action={actionFiltros}
              tipologias={opcoes.tipologias}
              freguesias={opcoes.freguesias}
              consultores={opcoes.consultores}
              valores={{
                tipologia: searchParams.tipologia,
                zona: searchParams.zona,
                consultor: searchParams.consultor,
              }}
            />
          </div>
        </aside>

        <div className="flex-1">
          {imoveis.length === 0 ? (
            <p className="text-foreground-secondary">
              Não há imóveis que correspondam a estes filtros.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {imoveis.map((imovel) => (
                <ImovelCard key={imovel.id} imovel={imovel} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
