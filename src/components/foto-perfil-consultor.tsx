"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { atualizarFotoConsultor } from "@/app/painel/(protected)/templates/actions";

export function FotoPerfilConsultor({
  consultorId,
  fotoUrlInicial,
}: {
  consultorId: string;
  fotoUrlInicial: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(fotoUrlInicial);
  const [aEnviar, setAEnviar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function selecionar(e: React.ChangeEvent<HTMLInputElement>) {
    const ficheiro = e.target.files?.[0];
    if (!ficheiro) return;

    setErro(null);
    setPreview(URL.createObjectURL(ficheiro));
    setAEnviar(true);

    const supabase = createClient();
    const caminho = `${consultorId}/${Date.now()}-${ficheiro.name}`;
    const { error: erroUpload } = await supabase.storage
      .from("fotos-consultor")
      .upload(caminho, ficheiro);

    if (erroUpload) {
      setErro("Não foi possível carregar a foto. Tenta novamente.");
      setAEnviar(false);
      return;
    }

    const urlPublico = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fotos-consultor/${caminho}`;
    await atualizarFotoConsultor(consultorId, urlPublico);
    setAEnviar(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-grid p-4">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="A tua foto de perfil" className="h-16 w-16 rounded-full object-cover" />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/10 text-sm font-bold text-brand-blue">
          Foto
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">A tua foto de perfil</p>
        <p className="text-xs text-foreground-secondary">
          Aparece nos templates de marketing. {aEnviar ? "A carregar..." : "Podes trocá-la quando quiseres."}
        </p>
        {erro && <p className="text-xs text-brand-red">{erro}</p>}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={aEnviar}
          className="mt-1 w-fit rounded-md border border-grid px-3 py-1.5 text-xs font-semibold transition hover:border-brand-blue hover:text-brand-blue disabled:opacity-60"
        >
          {preview ? "Trocar foto" : "Carregar foto"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={selecionar}
          className="hidden"
        />
      </div>
    </div>
  );
}
