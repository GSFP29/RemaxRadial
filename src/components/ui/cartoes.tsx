import Link from "next/link";
import type { LucideIcon } from "lucide-react";

// Vocabulário visual partilhado do painel — cartão com chip de ícone e
// acento de cor, reutilizado em várias áreas para dar uma identidade
// consistente sem depender de gradientes (CLAUDE.md secção 12: cores
// sólidas, não gradientes).

const CORES = {
  azul: {
    chip: "bg-brand-blue/10 text-brand-blue",
    borda: "border-brand-blue/30 hover:border-brand-blue",
    fundo: "bg-brand-blue/[0.03]",
  },
  vermelho: {
    chip: "bg-brand-red/10 text-brand-red",
    borda: "border-brand-red/30 hover:border-brand-red",
    fundo: "bg-brand-red/[0.03]",
  },
  chart1: { chip: "bg-chart-1/10 text-chart-1", borda: "border-grid", fundo: "" },
  chart2: { chip: "bg-chart-2/10 text-chart-2", borda: "border-grid", fundo: "" },
  chart3: { chip: "bg-chart-3/10 text-chart-3", borda: "border-grid", fundo: "" },
  chart4: { chip: "bg-chart-4/10 text-chart-4", borda: "border-grid", fundo: "" },
  neutro: { chip: "bg-foreground/[0.06] text-foreground-secondary", borda: "border-grid", fundo: "" },
} as const;

export type CorCartao = keyof typeof CORES;

export const CHIP_COR: Record<CorCartao, string> = Object.fromEntries(
  (Object.keys(CORES) as CorCartao[]).map((cor) => [cor, CORES[cor].chip]),
) as Record<CorCartao, string>;

export function CartaoLink({
  href,
  icone: Icone,
  titulo,
  descricao,
  cor = "neutro",
}: {
  href?: string;
  icone: LucideIcon;
  titulo: string;
  descricao: string;
  cor?: CorCartao;
}) {
  const c = CORES[cor];
  const conteudo = (
    <>
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${c.chip}`}>
        <Icone size={20} strokeWidth={2} />
      </div>
      <h2 className="font-semibold">{titulo}</h2>
      <p className="text-sm text-foreground-secondary">{descricao}</p>
    </>
  );

  const classes = `rounded-xl border p-4 transition ${href ? `${c.borda} ${c.fundo} hover:-translate-y-0.5 hover:shadow-sm` : "border-grid opacity-80"}`;

  if (!href) {
    return <div className={classes}>{conteudo}</div>;
  }

  return (
    <Link href={href} className={classes}>
      {conteudo}
    </Link>
  );
}

export function CartaoStat({
  icone: Icone,
  rotulo,
  valor,
  referencia,
  cor = "azul",
  destaque = false,
}: {
  icone: LucideIcon;
  rotulo: string;
  valor: string;
  referencia?: string;
  cor?: CorCartao;
  destaque?: boolean;
}) {
  const c = CORES[cor];
  return (
    <div className="rounded-xl border border-grid p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-foreground-secondary">{rotulo}</p>
        <div className={`flex h-7 w-7 items-center justify-center rounded-md ${c.chip}`}>
          <Icone size={14} strokeWidth={2} />
        </div>
      </div>
      <p className={`text-2xl font-bold ${destaque ? "text-brand-red" : ""}`}>{valor}</p>
      {referencia && <p className="text-xs text-foreground-secondary">{referencia}</p>}
    </div>
  );
}
