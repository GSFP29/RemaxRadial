// Motor de desenho dos templates de marketing (canvas 2D, sem dependências
// externas — funciona em qualquer browser, exporta PNG no cliente). Cada
// template é uma função de desenho pura: recebe o contexto, o tamanho e os
// dados/imagens escolhidos pelo consultor, e pinta tudo à mão.

export const AZUL = "#0033a0";
export const VERMELHO = "#c8102e";
export const BRANCO = "#ffffff";

export type FormatoTemplate = "post" | "story";

export const DIMENSOES: Record<FormatoTemplate, { w: number; h: number }> = {
  post: { w: 1080, h: 1080 },
  story: { w: 1080, h: 1920 },
};

export type CampoTemplate = {
  chave: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
};

export type ImagensTemplate = {
  foto: HTMLImageElement | null;
  headshot: HTMLImageElement | null;
  logo: HTMLImageElement | null;
};

export type Template = {
  id: string;
  nome: string;
  descricao: string;
  formato: FormatoTemplate;
  campos: CampoTemplate[];
  temFoto: boolean;
  precisaFoto: boolean;
  fotoLabel: string;
  usaHeadshot: boolean;
  desenhar: (
    ctx: CanvasRenderingContext2D,
    dados: Record<string, string>,
    imagens: ImagensTemplate,
    consultorNome: string,
  ) => void;
};

// ---------------------------------------------------------------------------
// Ajudantes de desenho
// ---------------------------------------------------------------------------

function desenharImagemCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;
  const imgRatio = imgW / imgH;
  const boxRatio = w / h;
  let sx: number, sy: number, sw: number, sh: number;
  if (imgRatio > boxRatio) {
    sh = imgH;
    sw = imgH * boxRatio;
    sx = (imgW - sw) / 2;
    sy = 0;
  } else {
    sw = imgW;
    sh = imgW / boxRatio;
    sx = 0;
    sy = (imgH - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function caminhoArredondado(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function retanguloArredondado(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  cor: string,
) {
  ctx.fillStyle = cor;
  caminhoArredondado(ctx, x, y, w, h, r);
  ctx.fill();
}

function desenharFundoPlaceholder(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = "#e5e7eb";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "600 32px Sora, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Adicione uma foto", x + w / 2, y + h / 2);
}

function desenharCirculo(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  cx: number,
  cy: number,
  r: number,
  anelCor?: string,
) {
  if (anelCor) {
    ctx.beginPath();
    ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
    ctx.fillStyle = anelCor;
    ctx.fill();
  }
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  if (img) {
    desenharImagemCover(ctx, img, cx - r, cy - r, r * 2, r * 2);
  } else {
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }
  ctx.restore();
}

function quebrarLinhas(
  ctx: CanvasRenderingContext2D,
  texto: string,
  maxWidth: number,
  maxLinhas = 99,
): string[] {
  const palavras = texto.split(/\s+/).filter(Boolean);
  const linhas: string[] = [];
  let linha = "";
  for (const palavra of palavras) {
    const teste = linha ? `${linha} ${palavra}` : palavra;
    if (ctx.measureText(teste).width > maxWidth && linha) {
      linhas.push(linha);
      linha = palavra;
    } else {
      linha = teste;
    }
  }
  if (linha) linhas.push(linha);
  if (linhas.length > maxLinhas) {
    const cortadas = linhas.slice(0, maxLinhas);
    cortadas[maxLinhas - 1] = `${cortadas[maxLinhas - 1].replace(/\s*\S*$/, "")}…`;
    return cortadas;
  }
  return linhas;
}

function desenharTextoQuebrado(
  ctx: CanvasRenderingContext2D,
  texto: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLinhas = 99,
): number {
  const linhas = quebrarLinhas(ctx, texto, maxWidth, maxLinhas);
  linhas.forEach((linha, i) => ctx.fillText(linha, x, y + i * lineHeight));
  return linhas.length;
}

function desenharGradiente(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  corTopo: string,
  corBase: string,
) {
  const grad = ctx.createLinearGradient(0, y, 0, y + h);
  grad.addColorStop(0, corTopo);
  grad.addColorStop(1, corBase);
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);
}

function desenharLogoChip(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement | null,
  x: number,
  y: number,
  larguraAlvo: number,
) {
  if (!logo) return;
  const razao = (logo.naturalHeight || logo.height) / (logo.naturalWidth || logo.width);
  const altura = larguraAlvo * razao;
  const padH = 20;
  const padV = 14;
  retanguloArredondado(ctx, x, y, larguraAlvo + padH * 2, altura + padV * 2, 14, BRANCO);
  ctx.drawImage(logo, x + padH, y + padV, larguraAlvo, altura);
}

function desenharEstrelas(ctx: CanvasRenderingContext2D, cx: number, cy: number, tamanho: number, cor: string) {
  const total = 5;
  const espaco = tamanho * 1.3;
  const inicioX = cx - (espaco * (total - 1)) / 2;
  for (let i = 0; i < total; i++) {
    desenharEstrela(ctx, inicioX + i * espaco, cy, tamanho, cor);
  }
}

function desenharEstrela(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, cor: string) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(cx, cy);
  ctx.moveTo(0, -r);
  for (let i = 0; i < 5; i++) {
    ctx.rotate(Math.PI / 5);
    ctx.lineTo(0, -r * 0.42);
    ctx.rotate(Math.PI / 5);
    ctx.lineTo(0, -r);
  }
  ctx.closePath();
  ctx.fillStyle = cor;
  ctx.fill();
  ctx.restore();
}

function desenharFaixaBrandingInferior(
  ctx: CanvasRenderingContext2D,
  y: number,
  w: number,
  h: number,
  logo: HTMLImageElement | null,
  headshot: HTMLImageElement | null,
  consultorNome: string,
) {
  ctx.fillStyle = BRANCO;
  ctx.fillRect(0, y, w, h);

  if (logo) {
    const razao = (logo.naturalHeight || logo.height) / (logo.naturalWidth || logo.width);
    const larguraLogo = 220;
    ctx.drawImage(logo, 48, y + (h - larguraLogo * razao) / 2, larguraLogo, larguraLogo * razao);
  }

  const r = (h - 40) / 2;
  const cx = w - 48 - r;
  const cy = y + h / 2;
  desenharCirculo(ctx, headshot, cx, cy, r, VERMELHO);
  ctx.fillStyle = "#111111";
  ctx.font = "700 26px Sora, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(consultorNome, cx - r - 20, cy);
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export const TEMPLATES: Template[] = [
  {
    id: "novo-imovel",
    nome: "Novo Imóvel",
    descricao: "Post quadrado para anunciar uma angariação nova.",
    formato: "post",
    precisaFoto: true,
    temFoto: true,
    fotoLabel: "Foto do imóvel",
    usaHeadshot: true,
    campos: [
      { chave: "tipologia", label: "Tipologia", placeholder: "T3 · Odivelas" },
      { chave: "morada", label: "Zona / morada", placeholder: "Avenidas Novas" },
      { chave: "preco", label: "Preço", placeholder: "320.000 €" },
    ],
    desenhar(ctx, dados, imagens, consultorNome) {
      const { w, h } = DIMENSOES.post;
      const faixaH = 180;
      const fotoH = h - faixaH;

      if (imagens.foto) desenharImagemCover(ctx, imagens.foto, 0, 0, w, fotoH);
      else desenharFundoPlaceholder(ctx, 0, 0, w, fotoH);

      desenharGradiente(ctx, 0, fotoH - 320, w, 320, "rgba(0,0,0,0)", "rgba(0,0,0,0.72)");

      // Ribbon "NOVO"
      ctx.save();
      ctx.translate(70, 70);
      ctx.rotate(-0.08);
      retanguloArredondado(ctx, -20, -10, 190, 74, 12, VERMELHO);
      ctx.fillStyle = BRANCO;
      ctx.font = "800 34px Sora, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("NOVO", 4, 28);
      ctx.restore();

      // Badge preço
      if (dados.preco) {
        ctx.font = "800 40px Sora, sans-serif";
        const larguraTexto = ctx.measureText(dados.preco).width;
        const largura = larguraTexto + 64;
        retanguloArredondado(ctx, w - largura - 48, 48, largura, 78, 39, AZUL);
        ctx.fillStyle = BRANCO;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(dados.preco, w - largura / 2 - 48, 48 + 39);
      }

      // Tipologia / morada
      ctx.fillStyle = BRANCO;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.font = "800 56px Sora, sans-serif";
      let baseY = fotoH - 130;
      if (dados.tipologia) {
        ctx.fillText(dados.tipologia, 56, baseY);
        baseY += 56;
      }
      if (dados.morada) {
        ctx.font = "600 34px Sora, sans-serif";
        desenharTextoQuebrado(ctx, dados.morada, 56, baseY, w - 112, 42, 2);
      }

      desenharFaixaBrandingInferior(ctx, fotoH, w, faixaH, imagens.logo, imagens.headshot, consultorNome);
    },
  },

  {
    id: "vendido",
    nome: "Imóvel Vendido",
    descricao: "Post para celebrar um negócio fechado.",
    formato: "post",
    precisaFoto: true,
    temFoto: true,
    fotoLabel: "Foto do imóvel ou da entrega de chaves",
    usaHeadshot: true,
    campos: [{ chave: "legenda", label: "Legenda", placeholder: "Mais uma chave entregue!", multiline: true }],
    desenhar(ctx, dados, imagens, consultorNome) {
      const { w, h } = DIMENSOES.post;
      const faixaH = 180;
      const fotoH = h - faixaH;

      if (imagens.foto) desenharImagemCover(ctx, imagens.foto, 0, 0, w, fotoH);
      else desenharFundoPlaceholder(ctx, 0, 0, w, fotoH);

      ctx.fillStyle = "rgba(0,0,0,0.38)";
      ctx.fillRect(0, 0, w, fotoH);

      // Faixa diagonal "VENDIDO"
      ctx.save();
      ctx.translate(w / 2, fotoH * 0.32);
      ctx.rotate(-0.22);
      retanguloArredondado(ctx, -280, -50, 560, 100, 8, VERMELHO);
      ctx.fillStyle = BRANCO;
      ctx.font = "800 56px Sora, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("VENDIDO", 0, 4);
      ctx.restore();

      if (dados.legenda) {
        ctx.fillStyle = BRANCO;
        ctx.font = "700 46px Sora, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        desenharTextoQuebrado(ctx, dados.legenda, w / 2, fotoH - 110, w - 160, 54, 3);
      }

      desenharFaixaBrandingInferior(ctx, fotoH, w, faixaH, imagens.logo, imagens.headshot, consultorNome);
    },
  },

  {
    id: "story-casa-aberta",
    nome: "Casa Aberta (Story)",
    descricao: "Story vertical para convidar a uma visita.",
    formato: "story",
    precisaFoto: true,
    temFoto: true,
    fotoLabel: "Foto do imóvel",
    usaHeadshot: true,
    campos: [
      { chave: "dataHora", label: "Data e hora", placeholder: "Sáb, 14h–17h" },
      { chave: "morada", label: "Morada", placeholder: "Rua das Flores, 12 — Odivelas" },
    ],
    desenhar(ctx, dados, imagens, consultorNome) {
      const { w, h } = DIMENSOES.story;
      const fotoH = 1360;
      const faixaH = h - fotoH;

      if (imagens.foto) desenharImagemCover(ctx, imagens.foto, 0, 0, w, fotoH);
      else desenharFundoPlaceholder(ctx, 0, 0, w, fotoH);

      desenharGradiente(ctx, 0, fotoH - 260, w, 260, "rgba(0,0,0,0)", "rgba(0,0,0,0.6)");

      ctx.fillStyle = AZUL;
      ctx.fillRect(0, fotoH, w, faixaH);

      ctx.fillStyle = BRANCO;
      ctx.font = "800 30px Sora, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      const letras = "C A S A   A B E R T A";
      ctx.fillText(letras, w / 2, fotoH + 90);

      ctx.font = "800 84px Sora, sans-serif";
      ctx.fillText(dados.dataHora || "Marque a sua visita", w / 2, fotoH + 210);

      if (dados.morada) {
        ctx.font = "600 38px Sora, sans-serif";
        desenharTextoQuebrado(ctx, dados.morada, w / 2, fotoH + 280, w - 160, 46, 2);
      }

      retanguloArredondado(ctx, w / 2 - 220, fotoH + 380, 440, 96, 48, VERMELHO);
      ctx.fillStyle = BRANCO;
      ctx.font = "800 38px Sora, sans-serif";
      ctx.fillText("Marca a tua visita", w / 2, fotoH + 380 + 60);

      desenharLogoChip(ctx, imagens.logo, 48, 48, 200);

      if (imagens.headshot) {
        const r = 60;
        desenharCirculo(ctx, imagens.headshot, w - 48 - r, 48 + r, r, BRANCO);
        ctx.fillStyle = BRANCO;
        ctx.font = "700 28px Sora, sans-serif";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(consultorNome, w - 48 - r * 2 - 16, 48 + r);
      }
    },
  },

  {
    id: "consultor-destaque",
    nome: "Depoimento de Cliente",
    descricao: "Post com a foto com o cliente e um testemunho.",
    formato: "post",
    precisaFoto: false,
    temFoto: true,
    fotoLabel: "Foto com o cliente (opcional)",
    usaHeadshot: true,
    campos: [
      { chave: "legenda", label: "Testemunho", placeholder: "Acompanhamento excelente do início ao fim!", multiline: true },
      { chave: "nomeCliente", label: "Nome do cliente", placeholder: "Nome do cliente" },
    ],
    desenhar(ctx, dados, imagens, consultorNome) {
      const { w, h } = DIMENSOES.post;

      ctx.fillStyle = "#f5f6f8";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = AZUL;
      ctx.fillRect(0, 0, w, 60);

      const fotoTam = 620;
      const fotoY = 110;
      if (imagens.foto) {
        retanguloArredondado(ctx, (w - fotoTam) / 2, fotoY, fotoTam, fotoTam, 28, "#e5e7eb");
        ctx.save();
        caminhoArredondado(ctx, (w - fotoTam) / 2, fotoY, fotoTam, fotoTam, 28);
        ctx.clip();
        desenharImagemCover(ctx, imagens.foto, (w - fotoTam) / 2, fotoY, fotoTam, fotoTam);
        ctx.restore();
      } else {
        desenharCirculo(ctx, imagens.headshot, w / 2, fotoY + fotoTam / 2, fotoTam / 2, VERMELHO);
      }

      desenharEstrelas(ctx, w / 2, fotoY + fotoTam + 70, 22, "#f5a623");

      ctx.fillStyle = "#111111";
      ctx.font = "italic 500 38px Sora, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      const legenda = dados.legenda ? `"${dados.legenda}"` : "";
      desenharTextoQuebrado(ctx, legenda, w / 2, fotoY + fotoTam + 150, w - 160, 48, 3);

      if (dados.nomeCliente) {
        ctx.font = "700 32px Sora, sans-serif";
        ctx.fillStyle = AZUL;
        ctx.fillText(`— ${dados.nomeCliente}`, w / 2, h - 170);
      }

      desenharFaixaBrandingInferior(ctx, h - 120, w, 120, imagens.logo, imagens.headshot, consultorNome);
    },
  },

  {
    id: "avaliacao-cta",
    nome: "Vamos Conversar",
    descricao: "Post genérico para gerar contactos — sem valores de imóveis.",
    formato: "post",
    precisaFoto: false,
    temFoto: true,
    fotoLabel: "Foto do imóvel ou estilo de vida (opcional)",
    usaHeadshot: true,
    campos: [
      { chave: "headline", label: "Frase principal", placeholder: "Quer vender o seu imóvel?" },
    ],
    desenhar(ctx, dados, imagens, consultorNome) {
      const { w, h } = DIMENSOES.post;
      const fotoH = 560;

      if (imagens.foto) desenharImagemCover(ctx, imagens.foto, 0, 0, w, fotoH);
      else {
        desenharGradiente(ctx, 0, 0, w, fotoH, AZUL, VERMELHO);
      }

      ctx.fillStyle = BRANCO;
      ctx.fillRect(0, fotoH, w, h - fotoH);

      ctx.fillStyle = "#111111";
      ctx.font = "800 62px Sora, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      desenharTextoQuebrado(ctx, dados.headline || "Quer vender o seu imóvel?", w / 2, fotoH + 110, w - 140, 68, 3);

      retanguloArredondado(ctx, w / 2 - 200, fotoH + 260, 400, 92, 46, VERMELHO);
      ctx.fillStyle = BRANCO;
      ctx.font = "800 36px Sora, sans-serif";
      ctx.fillText("Contacte-nos", w / 2, fotoH + 260 + 58);

      desenharFaixaBrandingInferior(ctx, h - 150, w, 150, imagens.logo, imagens.headshot, consultorNome);
    },
  },

  {
    id: "story-novo-imovel",
    nome: "Novo Imóvel (Story)",
    descricao: "Versão vertical do template de nova angariação.",
    formato: "story",
    precisaFoto: true,
    temFoto: true,
    fotoLabel: "Foto do imóvel",
    usaHeadshot: true,
    campos: [
      { chave: "tipologia", label: "Tipologia", placeholder: "T3 · Odivelas" },
      { chave: "morada", label: "Zona / morada", placeholder: "Avenidas Novas" },
      { chave: "preco", label: "Preço", placeholder: "320.000 €" },
    ],
    desenhar(ctx, dados, imagens, consultorNome) {
      const { w, h } = DIMENSOES.story;
      const faixaH = 260;
      const fotoH = h - faixaH;

      if (imagens.foto) desenharImagemCover(ctx, imagens.foto, 0, 0, w, fotoH);
      else desenharFundoPlaceholder(ctx, 0, 0, w, fotoH);

      desenharGradiente(ctx, 0, fotoH - 340, w, 340, "rgba(0,0,0,0)", "rgba(0,0,0,0.72)");

      ctx.save();
      ctx.translate(70, 90);
      ctx.rotate(-0.08);
      retanguloArredondado(ctx, -20, -10, 190, 74, 12, VERMELHO);
      ctx.fillStyle = BRANCO;
      ctx.font = "800 34px Sora, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("NOVO", 4, 28);
      ctx.restore();

      if (dados.preco) {
        ctx.font = "800 44px Sora, sans-serif";
        const larguraTexto = ctx.measureText(dados.preco).width;
        const largura = larguraTexto + 64;
        retanguloArredondado(ctx, w - largura - 48, 68, largura, 84, 42, AZUL);
        ctx.fillStyle = BRANCO;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(dados.preco, w - largura / 2 - 48, 68 + 42);
      }

      ctx.fillStyle = BRANCO;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.font = "800 64px Sora, sans-serif";
      let baseY = fotoH - 160;
      if (dados.tipologia) {
        ctx.fillText(dados.tipologia, 56, baseY);
        baseY += 62;
      }
      if (dados.morada) {
        ctx.font = "600 38px Sora, sans-serif";
        desenharTextoQuebrado(ctx, dados.morada, 56, baseY, w - 112, 46, 2);
      }

      desenharFaixaBrandingInferior(ctx, fotoH, w, faixaH, imagens.logo, imagens.headshot, consultorNome);
    },
  },

  {
    id: "conheca-o-consultor",
    nome: "Conheça o Consultor",
    descricao: "Post de apresentação pessoal, para novos seguidores.",
    formato: "post",
    precisaFoto: false,
    temFoto: false,
    fotoLabel: "",
    usaHeadshot: true,
    campos: [
      {
        chave: "introducao",
        label: "Frase de apresentação",
        placeholder: "Olá! Sou a Susana e vou ajudá-lo a encontrar a casa dos seus sonhos!",
        multiline: true,
      },
    ],
    desenhar(ctx, dados, imagens, consultorNome) {
      const { w, h } = DIMENSOES.post;

      desenharGradiente(ctx, 0, 0, w, h, AZUL, "#001d5c");

      const r = 260;
      desenharCirculo(ctx, imagens.headshot, w / 2, 380, r, BRANCO);

      ctx.fillStyle = BRANCO;
      ctx.font = "500 34px Sora, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      desenharTextoQuebrado(
        ctx,
        dados.introducao || "Olá! Vou ajudá-lo a encontrar a casa dos seus sonhos!",
        w / 2,
        720,
        w - 200,
        44,
        3,
      );

      ctx.font = "800 46px Sora, sans-serif";
      ctx.fillText(consultorNome, w / 2, 860);

      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "600 28px Sora, sans-serif";
      ctx.fillText("RE/MAX Radial", w / 2, 900);

      desenharLogoChip(ctx, imagens.logo, w / 2 - 110, h - 130, 180);
    },
  },
];

export function obterTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export async function esperarFonteSora() {
  try {
    await Promise.all([
      document.fonts.load("800 64px Sora"),
      document.fonts.load("700 32px Sora"),
      document.fonts.load("600 34px Sora"),
      document.fonts.load("italic 500 38px Sora"),
    ]);
  } catch {
    // Sem suporte a document.fonts — segue com a fonte de sistema.
  }
}

export function carregarImagem(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
