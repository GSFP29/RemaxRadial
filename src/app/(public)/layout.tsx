import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      {/* Barra de destaque com as cores da marca — sempre presente, discreta */}
      <div className="flex h-1.5">
        <div className="flex-1 bg-brand-red" />
        <div className="flex-1 bg-brand-blue" />
      </div>

      <header className="border-b border-grid px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-lg font-bold text-brand-blue">
            RE/MAX <span className="text-brand-red">Radial</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/comprar" className="hover:text-brand-blue">
              Comprar
            </Link>
            <Link href="/arrendar" className="hover:text-brand-blue">
              Arrendar
            </Link>
            {/* Só visível para quem já tem sessão (consultor/admin) — nunca
                para um visitante anónimo, ver CLAUDE.md secção 2. */}
            {user && (
              <Link
                href="/painel"
                className="rounded-full bg-brand-blue/10 px-3 py-1 text-brand-blue hover:bg-brand-blue/20"
              >
                Painel →
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      <footer className="border-t border-grid px-6 py-10 text-sm text-foreground-secondary">
        <div className="mx-auto flex max-w-5xl flex-col gap-1">
          <span className="font-semibold text-foreground">
            RE/MAX <span className="text-brand-red">Radial</span>
          </span>
          <span>Agência 12116 · Odivelas</span>
        </div>
      </footer>
    </div>
  );
}
