const CLASSE_SELECT =
  "rounded-md border border-grid bg-background px-3 py-2 text-sm outline-none focus:border-brand-blue";

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
      className="mb-8 flex flex-wrap items-end gap-4 rounded-lg border border-grid bg-brand-blue/[0.03] p-4"
    >
      <Campo label="Tipologia">
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

      <Campo label="Zona">
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

      <Campo label="Consultor">
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
        className="rounded-md bg-brand-blue px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
      >
        Filtrar
      </button>

      {temFiltroAtivo && (
        <a
          href={action}
          className="text-sm text-foreground-secondary underline"
        >
          Limpar filtros
        </a>
      )}
    </form>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-foreground-secondary">{label}</span>
      {children}
    </label>
  );
}
