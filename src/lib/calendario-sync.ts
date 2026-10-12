import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function obterOuCriarToken(consultorId: string): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tokens_calendario_pessoal")
    .select("token")
    .eq("consultor_id", consultorId)
    .maybeSingle();

  if (data?.token) return data.token as string;

  const { data: novo, error } = await supabase
    .from("tokens_calendario_pessoal")
    .insert({ consultor_id: consultorId })
    .select("token")
    .single();

  if (error) throw error;
  return novo.token as string;
}

// Usado pela rota do feed .ics, que não tem sessão (o token é a
// credencial) — por isso lê com a service role, não com o cliente normal.
export async function consultorIdPorToken(token: string): Promise<string | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("tokens_calendario_pessoal")
    .select("consultor_id")
    .eq("token", token)
    .maybeSingle();

  return (data?.consultor_id as string) ?? null;
}
