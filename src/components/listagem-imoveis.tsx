import { getTranslations } from "next-intl/server";
import {
  listarImoveisPorTipo,
  obterOpcoesFiltro,
  type TipoNegocio,
} from "@/lib/imoveis";
import { FiltrosImoveis } from "@/components/filtros-imoveis";
import { ImovelCard } from "@/components/imovel-card";
import { PaginacaoImoveis } from "@/components/paginacao-imoveis";

const POR_PAGINA = 18;

type Props = {
  tipo: TipoNegocio;
  titulo: string;
  actionFiltros: string;
  searchParams: {
    tipologia?: string;
    zona?: string;
    consultor?: string;
    pagina?: string;
  };
};

export async function ListagemImoveis({
  tipo,
  titulo,
  actionFiltros,
  searchParams,
}: Props) {
  const filtros = {
    tipologia: searchParams.tipologia,
    concelho: searchParams.zona,
    consultor: searchParams.consultor,
  };

  const t = await getTranslations("listing");
  const [todosImoveis, opcoes] = await Promise.all([
    listarImoveisPorTipo(tipo, filtros),
    obterOpcoesFiltro(tipo),
  ]);

  const totalPaginas = Math.max(1, Math.ceil(todosImoveis.length / POR_PAGINA));
  const paginaPedida = Number(searchParams.pagina) || 1;
  const paginaAtual = Math.min(Math.max(paginaPedida, 1), totalPaginas);
  const imoveis = todosImoveis.slice(
    (paginaAtual - 1) * POR_PAGINA,
    paginaAtual * POR_PAGINA,
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold">{titulo}</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        {todosImoveis.length}{" "}
        {todosImoveis.length === 1 ? t("available_one") : t("available_other")}
      </p>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="md:w-64 md:shrink-0">
          <div className="md:sticky md:top-6">
            <FiltrosImoveis
              action={actionFiltros}
              tipologias={opcoes.tipologias}
              concelhos={opcoes.concelhos}
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
            <p className="text-foreground-secondary">{t("empty")}</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {imoveis.map((imovel) => (
                <ImovelCard key={imovel.id} imovel={imovel} />
              ))}
            </div>
          )}

          <PaginacaoImoveis
            baseHref={actionFiltros}
            filtros={{
              tipologia: searchParams.tipologia,
              zona: searchParams.zona,
              consultor: searchParams.consultor,
            }}
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
          />
        </div>
      </div>
    </div>
  );
}
