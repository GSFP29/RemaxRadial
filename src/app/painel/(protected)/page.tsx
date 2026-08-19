import Link from "next/link";

const SEPARADORES = [
  {
    nome: "Desempenho da carteira",
    descricao: "Tempo no mercado e descidas de preço vs. referência histórica",
    href: "/painel/imoveis",
  },
  { nome: "Os meus imóveis", descricao: "Carteira, estado e dias em carteira" },
  { nome: "As minhas leads", descricao: "Funil pessoal e próximas ações" },
  { nome: "Pesquisa de mercado", descricao: "Filtros e mapa por zona" },
  { nome: "Contactos de parceiros", descricao: "Fornecedores e condições negociadas" },
  { nome: "Salas de reunião", descricao: "Calendário partilhado da agência" },
];

export default function PainelHome() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Painel</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SEPARADORES.map((s) =>
          s.href ? (
            <Link
              key={s.nome}
              href={s.href}
              className="rounded-lg border border-brand-blue/30 bg-brand-blue/[0.03] p-4 transition hover:border-brand-blue"
            >
              <h2 className="font-semibold text-brand-blue">{s.nome}</h2>
              <p className="text-sm text-foreground-secondary">{s.descricao}</p>
            </Link>
          ) : (
            <div key={s.nome} className="rounded-lg border border-grid p-4">
              <h2 className="font-semibold">{s.nome}</h2>
              <p className="text-sm text-foreground-secondary">{s.descricao}</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
