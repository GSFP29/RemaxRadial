"use client";

import { useEffect, useRef, useState } from "react";
import {
  DIMENSOES,
  carregarImagem,
  esperarFonteSora,
  type Template,
} from "@/lib/templates-marketing";

const CAMPO =
  "w-full rounded-md border border-grid bg-background px-3 py-2 text-sm outline-none focus:border-brand-blue";

export function EditorTemplateMarketing({
  template,
  consultorNome,
  fotoConsultorUrl,
  aoVoltar,
}: {
  template: Template;
  consultorNome: string;
  fotoConsultorUrl: string | null;
  aoVoltar: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dados, setDados] = useState<Record<string, string>>({});
  const [fotoImg, setFotoImg] = useState<HTMLImageElement | null>(null);
  const [headshotImg, setHeadshotImg] = useState<HTMLImageElement | null>(null);
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);
  const [aGerar, setAGerar] = useState(false);

  const { w, h } = DIMENSOES[template.formato];

  useEffect(() => {
    carregarImagem("/logo-radial.png").then(setLogoImg).catch(() => {});
    if (fotoConsultorUrl) {
      carregarImagem(fotoConsultorUrl).then(setHeadshotImg).catch(() => {});
    }
  }, [fotoConsultorUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let cancelado = false;
    esperarFonteSora().then(() => {
      if (cancelado) return;
      ctx.clearRect(0, 0, w, h);
      template.desenhar(
        ctx,
        dados,
        { foto: fotoImg, headshot: headshotImg, logo: logoImg },
        consultorNome || "Consultor",
      );
    });
    return () => {
      cancelado = true;
    };
  }, [template, dados, fotoImg, headshotImg, logoImg, consultorNome, w, h]);

  function selecionarFoto(e: React.ChangeEvent<HTMLInputElement>, aoDefinir: (img: HTMLImageElement) => void) {
    const ficheiro = e.target.files?.[0];
    if (!ficheiro) return;
    const url = URL.createObjectURL(ficheiro);
    carregarImagem(url).then(aoDefinir);
  }

  function descarregar() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setAGerar(true);
    canvas.toBlob((blob) => {
      setAGerar(false);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `radial-${template.id}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 lg:max-w-sm">
        <button
          type="button"
          onClick={aoVoltar}
          className="mb-4 text-sm font-medium text-brand-blue hover:underline"
        >
          ← Voltar aos templates
        </button>

        <h2 className="text-lg font-bold">{template.nome}</h2>
        <p className="mt-1 text-sm text-foreground-secondary">{template.descricao}</p>

        <div className="mt-5 flex flex-col gap-4">
          {template.temFoto && (
            <label className="text-sm font-medium">
              {template.fotoLabel}
              {template.precisaFoto && <span className="text-brand-red"> *</span>}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => selecionarFoto(e, setFotoImg)}
                className="mt-1 w-full text-sm"
              />
            </label>
          )}

          {template.usaHeadshot && (
            <label className="text-sm font-medium">
              A tua foto (opcional — usa a do teu perfil por omissão)
              <input
                type="file"
                accept="image/*"
                onChange={(e) => selecionarFoto(e, setHeadshotImg)}
                className="mt-1 w-full text-sm"
              />
            </label>
          )}

          {template.campos.map((campo) => (
            <label key={campo.chave} className="text-sm font-medium">
              {campo.label}
              {campo.multiline ? (
                <textarea
                  rows={3}
                  placeholder={campo.placeholder}
                  value={dados[campo.chave] ?? ""}
                  onChange={(e) => setDados((d) => ({ ...d, [campo.chave]: e.target.value }))}
                  className={`mt-1 ${CAMPO}`}
                />
              ) : (
                <input
                  type="text"
                  placeholder={campo.placeholder}
                  value={dados[campo.chave] ?? ""}
                  onChange={(e) => setDados((d) => ({ ...d, [campo.chave]: e.target.value }))}
                  className={`mt-1 ${CAMPO}`}
                />
              )}
            </label>
          ))}

          <button
            type="button"
            onClick={descarregar}
            disabled={aGerar || (template.precisaFoto && !fotoImg)}
            className="mt-2 w-full rounded-md bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-blue/30 transition hover:brightness-110 disabled:opacity-60"
          >
            {aGerar ? "A gerar..." : "Descarregar imagem"}
          </button>
          {template.precisaFoto && !fotoImg && (
            <p className="text-xs text-foreground-secondary">Adiciona uma foto para poderes descarregar.</p>
          )}
        </div>
      </div>

      <div className="flex flex-1 items-start justify-center">
        <canvas
          ref={canvasRef}
          width={w}
          height={h}
          className="w-full max-w-md rounded-lg border border-grid shadow-sm"
          style={{ aspectRatio: `${w} / ${h}` }}
        />
      </div>
    </div>
  );
}
