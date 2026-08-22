"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function PainelHeader({ email }: { email: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/painel/login");
    router.refresh();
  }

  return (
    <header className="border-b border-grid px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/painel" className="font-semibold text-brand-blue">
          RE/MAX Radial
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden text-foreground-secondary sm:inline">
            {email}
          </span>
          <button onClick={handleLogout} className="underline">
            Sair
          </button>
        </div>
      </div>

      <nav className="mt-3 flex flex-wrap gap-4 text-sm font-medium">
        <Link href="/painel" className="hover:text-brand-blue">
          Painel
        </Link>
        <Link href="/painel/imoveis" className="hover:text-brand-blue">
          Desempenho da carteira
        </Link>
        <Link href="/painel/documentos" className="hover:text-brand-blue">
          Documentos
        </Link>
        <span className="text-grid">|</span>
        <Link href="/comprar" className="text-foreground-secondary hover:text-brand-blue">
          Site: Comprar
        </Link>
        <Link href="/arrendar" className="text-foreground-secondary hover:text-brand-blue">
          Site: Arrendar
        </Link>
      </nav>
    </header>
  );
}
