import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ehAdministrador } from "@/lib/consultores";
import { PainelSidebar } from "@/components/painel-sidebar";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // A rota /painel/login vive fora deste layout no browser (redireciona antes
  // de chegar aqui), mas o middleware é a barreira real — isto é defesa extra.
  if (!user) {
    redirect("/painel/login");
  }

  const isAdmin = await ehAdministrador(user.id);

  return (
    <div className="flex min-h-full flex-1 md:flex-row flex-col">
      <PainelSidebar email={user.email ?? ""} isAdmin={isAdmin} />
      <main className="flex-1 overflow-x-hidden p-6">{children}</main>
    </div>
  );
}
