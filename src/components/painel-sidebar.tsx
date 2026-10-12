"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AlternarTema } from "@/components/alternar-tema";
import { NAV_PAINEL } from "@/lib/painel-nav";

export function PainelSidebar({
  email,
  isAdmin,
}: {
  email: string;
  isAdmin: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [aberto, setAberto] = useState(false);

  const itens = NAV_PAINEL.filter((item) => !item.soAdmin || isAdmin);

  async function terminarSessao() {
    await supabase.auth.signOut();
    router.push("/painel/login");
    router.refresh();
  }

  function estaAtivo(href: string) {
    return href === "/painel" ? pathname === "/painel" : pathname.startsWith(href);
  }

  const conteudoNav = (
    <>
      <Link
        href="/painel"
        onClick={() => setAberto(false)}
        className="mb-6 block px-3 text-lg font-bold text-brand-blue"
      >
        RE/MAX <span className="text-brand-red">Radial</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {itens.map((item) => {
          const Icone = item.icone;
          const atual = estaAtivo(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setAberto(false)}
              aria-current={atual ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                atual
                  ? "bg-brand-blue/10 text-brand-blue"
                  : "text-foreground-secondary hover:bg-brand-blue/5 hover:text-foreground"
              }`}
            >
              <Icone size={18} />
              {item.nome}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 flex flex-col gap-1 border-t border-grid pt-4">
        <Link
          href="/comprar"
          className="rounded-lg px-3 py-2 text-xs font-medium text-foreground-secondary hover:text-brand-blue"
        >
          Site: Comprar
        </Link>
        <Link
          href="/arrendar"
          className="rounded-lg px-3 py-2 text-xs font-medium text-foreground-secondary hover:text-brand-blue"
        >
          Site: Arrendar
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-grid px-3 pt-4">
        <span className="truncate text-xs text-foreground-secondary" title={email}>
          {email}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <AlternarTema />
          <button
            type="button"
            onClick={terminarSessao}
            aria-label="Sair"
            title="Sair"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-grid text-foreground-secondary transition hover:border-brand-red hover:text-brand-red"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Barra superior — só em ecrãs pequenos */}
      <div className="flex items-center justify-between border-b border-grid px-4 py-3 md:hidden">
        <Link href="/painel" className="font-bold text-brand-blue">
          RE/MAX <span className="text-brand-red">Radial</span>
        </Link>
        <button
          type="button"
          onClick={() => setAberto(true)}
          aria-label="Abrir menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-grid"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Gaveta — sempre montada, anima por transform/opacity (sem jank) */}
      <div
        aria-hidden={!aberto}
        className={`fixed inset-0 z-40 md:hidden ${aberto ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          onClick={() => setAberto(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
            aberto ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-y-0 left-0 flex w-72 flex-col bg-background p-4 shadow-xl transition-transform duration-200 ease-out ${
            aberto ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            type="button"
            onClick={() => setAberto(false)}
            aria-label="Fechar menu"
            className="mb-2 flex h-8 w-8 items-center justify-center self-end rounded-full text-foreground-secondary hover:bg-brand-blue/5"
          >
            <X size={18} />
          </button>
          {conteudoNav}
        </div>
      </div>

      {/* Sidebar fixa — ecrãs médios e grandes */}
      <aside className="hidden md:flex md:w-64 md:shrink-0 md:flex-col md:border-r md:border-grid md:p-4">
        {conteudoNav}
      </aside>
    </>
  );
}
