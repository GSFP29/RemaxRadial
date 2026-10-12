import { getTranslations } from "next-intl/server";
import { ListagemImoveis } from "@/components/listagem-imoveis";

export default async function ComprarPage({
  searchParams,
}: {
  searchParams: Promise<{
    tipologia?: string;
    zona?: string;
    consultor?: string;
    pagina?: string;
  }>;
}) {
  const t = await getTranslations("nav");
  return (
    <ListagemImoveis
      tipo="venda"
      titulo={t("buy")}
      actionFiltros="/comprar"
      searchParams={await searchParams}
    />
  );
}
