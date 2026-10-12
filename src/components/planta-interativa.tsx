"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { guardarHotspots } from "@/app/painel/(protected)/projetos/actions";
import { urlImagemProjeto, type Hotspot, type ProjetoInterativo } from "@/lib/projetos-formato";

// Protótipo: planta 2D com pontos de interesse clicáveis — não é o render
// 3D do vídeo de fotogrametria (isso exige drone e software especializado
// de terceiros). Mesmo componente serve para editar (consultor) e para
// visualizar (cliente, sem sessão), via a prop `editavel`.
export function PlantaInterativa({
  projeto,
  editavel = false,
}: {
  projeto: ProjetoInterativo;
  editavel?: boolean;
}) {
  const [hotspots, setHotspots] = useState<Hotspot[]>(projeto.hotspots);
  const [novoPonto, setNovoPonto] = useState<{ x: number; y: number } | null>(null);
  const [ativo, setAtivo] = useState<string | null>(null);
  const [aGuardar, setAGuardar] = useState(false);
  const [guardado, setGuardado] = useState(false);

  function aoClicarImagem(e: React.MouseEvent<HTMLDivElement>) {
    if (!editavel) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setAtivo(null);
    setNovoPonto({ x, y });
  }

  function adicionarHotspot(titulo: string, texto: string) {
    if (!novoPonto || !titulo.trim()) return;
    setHotspots((h) => [
      ...h,
      { id: crypto.randomUUID(), x: novoPonto.x, y: novoPonto.y, titulo, texto },
    ]);
    setNovoPonto(null);
  }

  function removerHotspot(id: string) {
    setHotspots((h) => h.filter((p) => p.id !== id));
    setAtivo(null);
  }

  async function guardar() {
    setAGuardar(true);
    const dados = new FormData();
    dados.set("id", projeto.id);
    dados.set("hotspots", JSON.stringify(hotspots));
    await guardarHotspots(dados);
    setAGuardar(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  }

  return (
    <div>
      <div
        onClick={aoClicarImagem}
        className={`relative w-full overflow-hidden rounded-xl border border-grid ${editavel ? "cursor-crosshair" : ""}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={urlImagemProjeto(projeto.imagem_path)}
          alt={projeto.titulo}
          className="w-full select-none"
          draggable={false}
        />

        {hotspots.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setNovoPonto(null);
              setAtivo(ativo === p.id ? null : p.id);
            }}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white shadow-lg ring-2 ring-white transition hover:scale-110"
          >
            +
          </button>
        ))}

        {hotspots.map((p) =>
          ativo === p.id ? (
            <div
              key={`popup-${p.id}`}
              onClick={(e) => e.stopPropagation()}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className="absolute z-10 w-48 -translate-x-1/2 translate-y-3 rounded-lg border border-grid bg-background p-3 text-sm shadow-xl"
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <p className="font-semibold">{p.titulo}</p>
                {editavel && (
                  <button
                    type="button"
                    onClick={() => removerHotspot(p.id)}
                    className="shrink-0 text-foreground-secondary hover:text-brand-red"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              {p.texto && <p className="text-foreground-secondary">{p.texto}</p>}
            </div>
          ) : null,
        )}

        {novoPonto && editavel && (
          <FormularioHotspot
            ponto={novoPonto}
            onGuardar={adicionarHotspot}
            onCancelar={() => setNovoPonto(null)}
          />
        )}
      </div>

      {editavel && (
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={guardar}
            disabled={aGuardar}
            className="rounded-md bg-brand-blue px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {aGuardar ? "A guardar..." : "Guardar pontos"}
          </button>
          {guardado && <span className="text-sm text-brand-blue">Guardado!</span>}
        </div>
      )}
    </div>
  );
}

function FormularioHotspot({
  ponto,
  onGuardar,
  onCancelar,
}: {
  ponto: { x: number; y: number };
  onGuardar: (titulo: string, texto: string) => void;
  onCancelar: () => void;
}) {
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ left: `${ponto.x}%`, top: `${ponto.y}%` }}
      className="absolute z-20 w-56 -translate-x-1/2 translate-y-3 rounded-lg border border-brand-blue bg-background p-3 shadow-xl"
    >
      <input
        autoFocus
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título (ex: Sala, 24m²)"
        className="mb-2 w-full rounded-md border border-grid bg-background px-2 py-1.5 text-sm"
      />
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Nota (opcional)"
        rows={2}
        className="mb-2 w-full rounded-md border border-grid bg-background px-2 py-1.5 text-sm"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onGuardar(titulo, texto)}
          className="rounded-md bg-brand-blue px-3 py-1 text-xs font-semibold text-white"
        >
          Adicionar
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-md border border-grid px-3 py-1 text-xs"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
