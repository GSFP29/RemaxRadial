const CLASSE_SELECT =
  "w-full rounded-md border border-grid bg-background px-3 py-2 text-sm outline-none focus:border-brand-blue";

type Props = {
  action: string;
  tipologias: string[];
  freguesias: string[];
  consultores: string[];
  valores: { tipologia?: string; zona?: string; consultor?: string };
};

export function FiltrosImoveis({
  action,
  tipologias,
  freguesias,
  consultores,
  valores,
}: Props) {
  const temFiltroAtivo = valores.tipologia || valores.zona || valores.consultor;

  return (
    <form
      action={action}
      className="flex w-full flex-col gap-5 rounded-lg border border-grid p-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filtros</h2>
        {temFiltroAtivo && (
          <a href={action} className="text-xs text-brand-blue underline">
            Limpar
          </a>
        )}
      </div>

      <Campo icone={<IconeTipologia />} label="Tipologia">
        <select
          name="tipologia"
          defaultValue={valores.tipologia ?? ""}
          className={CLASSE_SELECT}
        >
          <option value="">Todas</option>
          {tipologias.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Campo>

      <Campo icone={<IconeZona />} label="Zona">
        <select
          name="zona"
          defaultValue={valores.zona ?? ""}
          className={CLASSE_SELECT}
        >
          <option value="">Todas</option>
          {freguesias.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </Campo>

      <Campo icone={<IconeConsultor />} label="Consultor responsável">
        <select
          name="consultor"
          defaultValue={valores.consultor ?? ""}
          className={CLASSE_SELECT}
        >
          <option value="">Todos</option>
          {consultores.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Campo>

      <button
        type="submit"
        className="w-full rounded-md bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
      >
        Filtrar
      </button>
    </form>
  );
}

function Campo({
  icone,
  label,
  children,
}: {
  icone: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground-secondary">
        {icone}
        {label}
      </div>
      {children}
    </div>
  );
}

function IconeTipologia() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4 text-brand-blue"
    >
      <rect x="2.5" y="2.5" width="6" height="6" rx="1" />
      <rect x="11.5" y="2.5" width="6" height="6" rx="1" />
      <rect x="2.5" y="11.5" width="6" height="6" rx="1" />
      <rect x="11.5" y="11.5" width="6" height="6" rx="1" />
    </svg>
  );
}

function IconeZona() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4 text-brand-blue"
    >
      <path d="M10 18s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="10" cy="8" r="2" />
    </svg>
  );
}

function IconeConsultor() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4 text-brand-blue"
    >
      <circle cx="10" cy="6.5" r="3.5" />
      <path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6" />
    </svg>
  );
}
