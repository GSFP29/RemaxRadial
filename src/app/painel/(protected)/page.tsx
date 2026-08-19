const SEPARADORES = [
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
        {SEPARADORES.map((s) => (
          <div
            key={s.nome}
            className="rounded-lg border border-grid p-4"
          >
            <h2 className="font-semibold">{s.nome}</h2>
            <p className="text-sm text-foreground-secondary">{s.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
