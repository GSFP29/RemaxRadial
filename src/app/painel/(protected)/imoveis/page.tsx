import {
  listarAlteracoesPorImovel,
  listarImoveisParaDashboard,
} from "@/lib/imoveis-admin";
import { DashboardImoveis } from "@/components/dashboard-imoveis";

export default async function ImoveisDashboardPage() {
  const [imoveis, alteracoesPorImovel] = await Promise.all([
    listarImoveisParaDashboard(),
    listarAlteracoesPorImovel(),
  ]);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Desempenho da carteira</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        Tempo no mercado e descidas de preço, ao lado da referência
        histórica de 22 anos. Clica numa linha para mais detalhe.
      </p>

      <DashboardImoveis
        imoveis={imoveis}
        alteracoesPorImovel={alteracoesPorImovel}
      />
    </div>
  );
}
