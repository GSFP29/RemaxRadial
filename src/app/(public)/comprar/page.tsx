import { ListagemImoveis } from "@/components/listagem-imoveis";

export default async function ComprarPage({
  searchParams,
}: {
  searchParams: Promise<{ tipologia?: string; zona?: string; consultor?: string }>;
}) {
  return (
    <ListagemImoveis
      tipo="venda"
      titulo="Comprar"
      actionFiltros="/comprar"
      searchParams={await searchParams}
    />
  );
}
