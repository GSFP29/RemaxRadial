"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { criarProjeto } from "@/app/painel/(protected)/projetos/actions";

export function FormularioNovoProjeto({ consultorId }: { consultorId: string }) {
  const [aEnviar, setAEnviar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  async function submeter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);

    const form = e.currentTarget;
    const titulo = (form.elements.namedItem("titulo") as HTMLInputElement).value.trim();
    const ficheiro = (form.elements.namedItem("imagem") as HTMLInputElement).files?.[0];
    if (!titulo || !ficheiro) return;

    setAEnviar(true);
    const supabase = createClient();
    const caminho = `${consultorId}/${Date.now()}-${ficheiro.name}`;
    const { error: erroUpload } = await supabase.storage
      .from("plantas-projetos")
      .upload(caminho, ficheiro);

    if (erroUpload) {
      setErro("Não foi possível carregar a imagem. Tenta novamente.");
      setAEnviar(false);
      return;
    }

    const dados = new FormData();
    dados.set("consultorId", consultorId);
    dados.set("titulo", titulo);
    dados.set("imagemPath", caminho);
    await criarProjeto(dados);

    form.reset();
    setAEnviar(false);
    router.refresh();
  }

  return (
    <form
      onSubmit={submeter}
      className="flex flex-col gap-3 rounded-xl border border-grid p-5 sm:flex-row sm:items-end"
    >
      <label className="flex-1 text-sm font-medium">
        Título do projeto
        <input
          name="titulo"
          required
          placeholder="Ex: T3 Moradia — Odivelas"
          className="mt-1 w-full rounded-md border border-grid bg-background px-3 py-2 text-sm"
        />
      </label>
      <label className="flex-1 text-sm font-medium">
        Planta (imagem)
        <input
          name="imagem"
          type="file"
          accept="image/*"
          required
          className="mt-1 w-full text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={aEnviar}
        className="rounded-md bg-brand-blue px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {aEnviar ? "A carregar..." : "Carregar"}
      </button>
      {erro && <p className="text-sm text-brand-red sm:basis-full">{erro}</p>}
    </form>
  );
}
