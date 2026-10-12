"use client";

import { useEffect, useRef, useState } from "react";
import {
  DIMENSOES,
  TEMPLATES,
  carregarImagem,
  esperarFonteSora,
  type Template,
} from "@/lib/templates-marketing";
import { EditorTemplateMarketing } from "@/components/editor-template-marketing";
import { FotoPerfilConsultor } from "@/components/foto-perfil-consultor";

const LARGURA_PREVIA = 260;

function PreviaTemplate({ template, logo }: { template: Template; logo: HTMLImageElement | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { w, h } = DIMENSOES[template.formato];
  const altura = LARGURA_PREVIA * (h / w);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const escala = LARGURA_PREVIA / w;
    let cancelado = false;
    esperarFonteSora().then(() => {
      if (cancelado) return;
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(escala, escala);
      const dadosDemo = Object.fromEntries(template.campos.map((c) => [c.chave, c.placeholder]));
      template.desenhar(ctx, dadosDemo, { foto: null, headshot: null, logo }, "O teu nome");
      ctx.restore();
    });
    return () => {
      cancelado = true;
    };
  }, [template, logo, w, h]);

  return (
    <canvas
      ref={canvasRef}
      width={LARGURA_PREVIA}
      height={altura}
      className="w-full rounded-lg border border-grid"
      style={{ aspectRatio: `${w} / ${h}` }}
    />
  );
}

export function GaleriaTemplatesMarketing({
  consultorId,
  consultorNome,
  fotoConsultorUrl,
}: {
  consultorId: string;
  consultorNome: string;
  fotoConsultorUrl: string | null;
}) {
  const [selecionado, setSelecionado] = useState<Template | null>(null);
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    carregarImagem("/logo-radial.png").then(setLogo).catch(() => {});
  }, []);

  if (selecionado) {
    return (
      <EditorTemplateMarketing
        template={selecionado}
        consultorNome={consultorNome}
        fotoConsultorUrl={fotoConsultorUrl}
        aoVoltar={() => setSelecionado(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <FotoPerfilConsultor consultorId={consultorId} fotoUrlInicial={fotoConsultorUrl} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => setSelecionado(template)}
            className="flex flex-col gap-3 rounded-xl border border-grid p-4 text-left transition hover:border-brand-blue hover:shadow-sm"
          >
            <PreviaTemplate template={template} logo={logo} />
            <div>
              <p className="text-sm font-bold">{template.nome}</p>
              <p className="mt-0.5 text-xs text-foreground-secondary">{template.descricao}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
