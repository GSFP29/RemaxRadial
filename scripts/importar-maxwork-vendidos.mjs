// Importa e agrega vendas reais extraídas do MAXWORK ("Estudos de
// Mercado"), via sessão assistida no browser — ver docs/decisoes.md,
// secção Credenciais. Calcula percentis de preço/m² por concelho e por
// concelho+tipologia, e grava em referencias_maxwork.
//
// Uso:
//   node --env-file=.env.local scripts/importar-maxwork-vendidos.mjs "C:\caminho\vendidos.json" [periodoMeses]
//
// periodoMeses (opcional, default 24) fica só como metadado informativo —
// não filtra nada, assume-se que o ficheiro já vem recortado pela janela
// certa (ver o script de extração usado no browser).

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const caminho = process.argv[2];
const periodoMeses = Number(process.argv[3]) || 24;

if (!caminho) {
  console.error("Uso: node --env-file=.env.local scripts/importar-maxwork-vendidos.mjs <ficheiro.json> [periodoMeses]");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

// Mesma interpolação linear usada em src/lib/avaliacao-formato.ts — mantida
// à parte porque este script corre fora do Next.js.
function percentil(valores, p) {
  const ordenados = [...valores].sort((a, b) => a - b);
  if (ordenados.length === 1) return ordenados[0];
  const indice = (p / 100) * (ordenados.length - 1);
  const baixo = Math.floor(indice);
  const alto = Math.ceil(indice);
  if (baixo === alto) return ordenados[baixo];
  const fracao = indice - baixo;
  return ordenados[baixo] + (ordenados[alto] - ordenados[baixo]) * fracao;
}

function agregar(registos) {
  const precosM2 = registos.map((r) => r.soldPrice / r.livingArea);
  const dias = registos.map((r) => r.marketDays).filter((d) => Number.isFinite(d) && d >= 0);
  return {
    amostra_n: registos.length,
    preco_m2_p10: percentil(precosM2, 10),
    preco_m2_p25: percentil(precosM2, 25),
    preco_m2_p50: percentil(precosM2, 50),
    preco_m2_p75: percentil(precosM2, 75),
    preco_m2_p90: percentil(precosM2, 90),
    mediana_dias_mercado: dias.length ? percentil(dias, 50) : null,
    periodo_meses: periodoMeses,
  };
}

async function main() {
  const bruto = JSON.parse(readFileSync(caminho, "utf-8"));
  console.log(`${bruto.length} registos no ficheiro.`);

  // Só habitação (listingClassID 1 — 2 é comercial), com preço e área
  // válidos. Vendas sem soldDate/livingArea não servem para comparáveis.
  const validos = bruto.filter(
    (r) => r.listingClassID === 1 && r.soldPrice > 0 && r.livingArea > 0,
  );
  console.log(`${validos.length} registos válidos (habitação, preço e área).`);

  const porConcelho = new Map();
  for (const r of validos) {
    const concelho = r.regionName2;
    if (!concelho) continue;
    if (!porConcelho.has(concelho)) porConcelho.set(concelho, []);
    porConcelho.get(concelho).push(r);
  }

  const linhas = [];
  for (const [concelho, registos] of porConcelho) {
    // Linha "qualquer tipologia" (tipologia vazia) — usada como fallback
    // quando a amostra específica é curta, mesmo espírito do simulador.
    linhas.push({ concelho, tipologia: "", ...agregar(registos) });

    const porTipologia = new Map();
    for (const r of registos) {
      const n = r.numberOfBedrooms;
      if (n == null || n < 0 || n > 7) continue; // T0–T7 é o que o simulador oferece
      const tipologia = `T${n}`;
      if (!porTipologia.has(tipologia)) porTipologia.set(tipologia, []);
      porTipologia.get(tipologia).push(r);
    }
    for (const [tipologia, regs] of porTipologia) {
      if (regs.length < 3) continue; // amostra mínima, mesmo critério do simulador
      linhas.push({ concelho, tipologia, ...agregar(regs) });
    }
  }

  console.log(`${linhas.length} linhas a gravar (concelhos + concelho×tipologia).`);

  const { error } = await supabase
    .from("referencias_maxwork")
    .upsert(
      linhas.map((l) => ({ ...l, atualizado_em: new Date().toISOString() })),
      { onConflict: "concelho,tipologia" },
    );

  if (error) {
    console.error("Erro ao gravar:", error.message);
    process.exit(1);
  }

  console.log("Importação concluída.");
}

main();
