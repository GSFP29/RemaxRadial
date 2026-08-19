"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Email ou palavra-passe incorretos.");
      return;
    }

    router.push("/painel");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-lg border border-grid p-8"
    >
      <h1 className="mb-1 text-xl font-semibold">RE/MAX Radial</h1>
      <p className="mb-6 text-sm text-foreground-secondary">
        Acesso de consultores e administração
      </p>

      <label className="mb-1 block text-sm font-medium" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 w-full rounded-md border border-grid bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />

      <label className="mb-1 block text-sm font-medium" htmlFor="password">
        Palavra-passe
      </label>
      <input
        id="password"
        type="password"
        required
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 w-full rounded-md border border-grid bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-blue"
      />

      {error && (
        <p className="mb-4 text-sm text-brand-red" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-brand-red px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "A entrar…" : "Entrar"}
      </button>
    </form>
  );
}
