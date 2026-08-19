"use client";

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
    <header className="flex items-center justify-between border-b border-grid px-6 py-4">
      <span className="font-semibold text-brand-blue">RE/MAX Radial</span>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-foreground-secondary">{email}</span>
        <button onClick={handleLogout} className="underline">
          Sair
        </button>
      </div>
    </header>
  );
}
