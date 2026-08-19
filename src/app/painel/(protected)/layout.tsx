import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PainelHeader } from "./painel-header";

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

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <PainelHeader email={user.email ?? ""} />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
