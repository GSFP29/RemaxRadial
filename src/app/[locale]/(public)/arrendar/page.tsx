import { getTranslations } from "next-intl/server";
import { ListagemImoveis } from "@/components/listagem-imoveis";

export default async function ArrendarPage({
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
      tipo="arrendamento"
      titulo={t("rent")}
      actionFiltros="/arrendar"
      searchParams={await searchParams}
    />
  );
}
