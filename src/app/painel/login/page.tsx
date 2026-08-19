import { LoginForm } from "./login-form";

// Depende de variáveis de ambiente do Supabase em runtime — nunca prerenderizar.
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <LoginForm />
    </main>
  );
}
