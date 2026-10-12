"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const CHAVE = "radial-tema";

export function AlternarTema({ className = "" }: { className?: string }) {
  const [escuro, setEscuro] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    setEscuro(document.documentElement.dataset.theme === "dark");
    setPronto(true);
  }, []);

  function alternar() {
    const novo = !escuro;
    setEscuro(novo);
    document.documentElement.dataset.theme = novo ? "dark" : "light";
    localStorage.setItem(CHAVE, novo ? "dark" : "light");
  }

  if (!pronto) {
    return <span className={`inline-block h-8 w-8 ${className}`} aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={escuro ? "Ativar modo claro" : "Ativar modo escuro"}
      title={escuro ? "Modo claro" : "Modo escuro"}
      className={`flex h-8 w-8 items-center justify-center rounded-full border border-grid text-foreground-secondary transition hover:border-brand-blue hover:text-brand-blue ${className}`}
    >
      {escuro ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
