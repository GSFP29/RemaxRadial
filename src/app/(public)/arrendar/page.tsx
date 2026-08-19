import { ListagemImoveis } from "@/components/listagem-imoveis";

export default async function ArrendarPage({
  searchParams,
}: {
  searchParams: Promise<{ tipologia?: string; zona?: string; consultor?: string }>;
}) {
  return (
    <ListagemImoveis
      tipo="arrendamento"
      titulo="Arrendar"
      actionFiltros="/arrendar"
      searchParams={await searchParams}
    />
  );
}
