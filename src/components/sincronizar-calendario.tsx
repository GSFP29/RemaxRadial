"use client";

import { useState } from "react";
import { Apple, Check, Copy, Smartphone } from "lucide-react";

type Aba = "iphone" | "android" | "computador";

export function SincronizarCalendario({ token }: { token: string }) {
  const [aba, setAba] = useState<Aba>("iphone");
  const [copiado, setCopiado] = useState(false);

  const urlFeed = typeof window !== "undefined" ? `${window.location.origin}/api/calendario/${token}` : "";
  const urlWebcal = urlFeed.replace(/^https?:\/\//, "webcal://");

  async function copiarLink() {
    await navigator.clipboard.writeText(urlFeed);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="rounded-xl border border-brand-blue/30 bg-brand-blue/[0.03] p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
          <Smartphone size={20} />
        </div>
        <div>
          <p className="font-bold">Sincronizar com o telemóvel</p>
          <p className="text-xs text-foreground-secondary">
            As tuas visitas, eventos e escalas aparecem sozinhos na app de Calendário
          </p>
        </div>
      </div>

      <div className="mb-4 flex gap-1 rounded-lg bg-foreground/[0.05] p-1 text-sm">
        {(
          [
            ["iphone", "iPhone"],
            ["android", "Android"],
            ["computador", "Computador"],
          ] as [Aba, string][]
        ).map(([valor, rotulo]) => (
          <button
            key={valor}
            type="button"
            onClick={() => setAba(valor)}
            className={`flex-1 rounded-md px-3 py-1.5 font-semibold transition ${
              aba === valor ? "bg-background shadow-sm" : "text-foreground-secondary"
            }`}
          >
            {rotulo}
          </button>
        ))}
      </div>

      {aba === "iphone" && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-foreground-secondary">
            Um toque e o iPhone pergunta se queres subscrever — dizes que sim e está feito.
          </p>
          <a
            href={urlWebcal}
            className="flex items-center justify-center gap-2 rounded-md bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <Apple size={16} /> Adicionar ao iPhone
          </a>
        </div>
      )}

      {aba === "android" && (
        <div className="flex flex-col gap-2 text-sm text-foreground-secondary">
          <p>
            1. Copia o link abaixo. 2. No telemóvel ou computador, abre o Google
            Calendar. 3. Em &ldquo;Outros calendários&rdquo;, toca em <strong>+</strong> →{" "}
            <strong>A partir do URL</strong>. 4. Cola o link e confirma.
          </p>
          <p>
            Passados uns minutos aparece também na app do telemóvel — é a mesma conta
            Google.
          </p>
        </div>
      )}

      {aba === "computador" && (
        <div className="flex flex-col gap-2 text-sm text-foreground-secondary">
          <p>
            Copia o link abaixo e usa a opção &ldquo;Subscrever calendário&rdquo; ou
            &ldquo;Adicionar por URL&rdquo; da tua aplicação (Outlook, Apple Calendário
            ou Google Calendar).
          </p>
        </div>
      )}

      {(aba === "android" || aba === "computador") && (
        <button
          type="button"
          onClick={copiarLink}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-brand-blue px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          {copiado ? (
            <>
              <Check size={16} /> Copiado!
            </>
          ) : (
            <>
              <Copy size={16} /> Copiar link do calendário
            </>
          )}
        </button>
      )}
    </div>
  );
}
