// Importa leads a partir dos ficheiros JSON obtidos via a API paginada
// do MAXWORK (/api/Lead/SearchWithPagination), extraídos com sessão
// assistida diretamente no browser — ver docs/decisoes.md.
//
// Uso:
//   node --env-file=.env.local scripts/importar-leads-maxwork-json.mjs "C:\caminho\lote1.json" "C:\caminho\lote2.json" ...
//
// Idempotente: usa o "id" do MAXWORK como id_externo.

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const caminhos = process.argv.slice(2);
if (caminhos.length === 0) {
  console.error("Uso: node --env-file=.env.local scripts/importar-leads-maxwork-json.mjs <ficheiro1.json> [ficheiro2.json ...]");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const ORIGEM_POR_TEXTO = {
  "site remax.pt": "formulario_site",
  "portal idealista": "idealista",
  "portal imovirtual": "imovirtual",
  "portal casayes": "casayes",
};

function mapearOrigem(origemTexto) {
  const chave = (origemTexto ?? "").trim().toLowerCase();
  return ORIGEM_POR_TEXTO[chave] ?? "outro";
}

const ESTADO_POR_TEXTO = {
  pendente: "novo",
  contacto: "contactado",
  qualificada: "qualificado",
  arquivado: "perdido",
  expirada: "perdido",
};

function mapearEstado(statusName) {
  const chave = (statusName ?? "").trim().toLowerCase();
  return ESTADO_POR_TEXTO[chave] ?? (chave || "novo");
}

function normalizarTelefone(mobilePhone, ddi) {
  if (!mobilePhone || mobilePhone === "--") return null;
  let numero = String(mobilePhone).trim();
  if (ddi && !numero.startsWith(ddi.replace("+", ""))) {
    numero = numero.startsWith("+") ? numero : `${ddi}${numero}`;
  }
  if (/^9\d{8}$/.test(numero)) return `+351${numero}`;
  if (/^\d+$/.test(numero) && !numero.startsWith("+")) return `+${numero}`;
  return numero;
}

async function main() {
  const linhas = caminhos.flatMap((c) => JSON.parse(readFileSync(c, "utf8")));
  console.log(`${linhas.length} registos lidos de ${caminhos.length} ficheiro(s).`);

  const refsImoveis = [
    ...new Set(linhas.map((l) => l.listingTitle).filter(Boolean)),
  ];

  // A tabela imoveis só tem a carteira atual — a maioria das refs
  // históricas não vai encontrar correspondência, o que é esperado.
  const idImovelPorRef = new Map();
  const LOTE = 500;
  for (let i = 0; i < refsImoveis.length; i += LOTE) {
    const fatia = refsImoveis.slice(i, i + LOTE);
    const { data } = await supabase
      .from("imoveis")
      .select("id, ref_remax")
      .in("ref_remax", fatia);
    for (const row of data ?? []) idImovelPorRef.set(row.ref_remax, row.id);
  }

  const porId = new Map();
  for (const linha of linhas) {
    // O mesmo lead pode aparecer em vários estados ao longo do tempo;
    // ficamos só com o registo mais recente por id.
    const existente = porId.get(linha.id);
    if (existente && new Date(existente.created) > new Date(linha.created)) continue;
    porId.set(linha.id, linha);
  }

  const paraInserir = [...porId.values()].map((linha) => ({
    id_externo: String(linha.id),
    origem: mapearOrigem(linha.originLeadName),
    nome: linha.leadName || null,
    telefone: normalizarTelefone(
      linha.leadTelephone?.mobilePhone,
      linha.leadTelephone?.mobilePhoneDDI,
    ),
    email: linha.leadPhoneOrEmail?.includes("@") ? linha.leadPhoneOrEmail : null,
    mensagem: null,
    imovel_id: idImovelPorRef.get(linha.listingTitle) ?? null,
    consultor_id: null,
    estado: mapearEstado(linha.statusName),
    criado_em: linha.created ?? linha.leadDate ?? new Date().toISOString(),
  }));

  console.log(`${paraInserir.length} leads únicas (por id) a importar.`);

  const LOTE_INSERT = 1000;
  let totalInserido = 0;
  for (let i = 0; i < paraInserir.length; i += LOTE_INSERT) {
    const fatia = paraInserir.slice(i, i + LOTE_INSERT);
    const { error } = await supabase
      .from("leads")
      .upsert(fatia, { onConflict: "id_externo", ignoreDuplicates: false });

    if (error) {
      console.error(`Erro no lote ${i / LOTE_INSERT + 1}:`, error.message);
      process.exit(1);
    }
    totalInserido += fatia.length;
    console.log(`Gravadas ${totalInserido} / ${paraInserir.length}`);
  }

  console.log("Importação concluída.");
}

main();
