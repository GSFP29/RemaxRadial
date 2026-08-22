import { listarDocumentos, type DocumentoConsultor } from "@/lib/documentos";

const ROTULO_IDIOMA: Record<DocumentoConsultor["idioma"], string> = {
  pt: "PT",
  en: "EN",
  pt_en: "PT/EN",
};

function agruparPorCategoria(docs: DocumentoConsultor[]) {
  const grupos = new Map<string, DocumentoConsultor[]>();
  for (const doc of docs) {
    const lista = grupos.get(doc.categoria) ?? [];
    lista.push(doc);
    grupos.set(doc.categoria, lista);
  }
  return grupos;
}

export default async function DocumentosPage({
  searchParams,
}: {
  searchParams: Promise<{ idioma?: string }>;
}) {
  const { idioma } = await searchParams;
  const todos = await listarDocumentos();

  const filtrados =
    idioma === "pt" || idioma === "en"
      ? todos.filter((d) => d.idioma === idioma || d.idioma === "pt_en")
      : todos;

  const grupos = agruparPorCategoria(filtrados);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Documentos</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        Contratos, fichas e checklists para o dia a dia.
      </p>

      <div className="mb-6 flex gap-2 text-sm">
        <FiltroIdioma valor={idioma} alvo={undefined} rotulo="Todos" />
        <FiltroIdioma valor={idioma} alvo="pt" rotulo="Português" />
        <FiltroIdioma valor={idioma} alvo="en" rotulo="English" />
      </div>

      <div className="flex flex-col gap-8">
        {[...grupos.entries()].map(([categoria, docs]) => (
          <div key={categoria}>
            <h2 className="mb-3 font-semibold">{categoria}</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {docs.map((doc) => (
                <a
                  key={doc.id}
                  href={`/api/documentos/${doc.id}/download`}
                  className="flex items-center justify-between gap-3 rounded-md border border-grid px-4 py-3 text-sm hover:border-brand-blue"
                >
                  <span>{doc.nome}</span>
                  <span className="shrink-0 rounded-full bg-brand-blue/10 px-2 py-0.5 text-xs font-semibold text-brand-blue">
                    {ROTULO_IDIOMA[doc.idioma]}
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FiltroIdioma({
  valor,
  alvo,
  rotulo,
}: {
  valor: string | undefined;
  alvo: string | undefined;
  rotulo: string;
}) {
  const ativo = valor === alvo || (!valor && !alvo);
  const href = alvo ? `/painel/documentos?idioma=${alvo}` : "/painel/documentos";

  return (
    <a
      href={href}
      className={`rounded-full px-4 py-1.5 font-medium ${
        ativo
          ? "bg-brand-blue text-white"
          : "border border-grid text-foreground-secondary hover:border-brand-blue"
      }`}
    >
      {rotulo}
    </a>
  );
}
