// Importa leads a partir de um export do MAXWORK (Comercial → Leads →
// "Exportar dados"). Corre-se à mão depois de cada exportação assistida —
// ver docs/decisoes.md, secção Credenciais, sobre porque não é automático.
//
// Uso:
//   node --env-file=.env.local scripts/importar-leads-maxwork.mjs "C:\caminho\Leads.xlsx"
//
// Idempotente: usa o "Id" do MAXWORK como id_externo, por isso corrida
// duas vezes sobre o mesmo ficheiro não duplica leads.

import xlsx from "xlsx";
import { createClient } from "@supabase/supabase-js";

const caminho = process.argv[2];
if (!caminho) {
  console.error("Uso: node --env-file=.env.local scripts/importar-leads-maxwork.mjs <ficheiro.xlsx>");
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

// Mesma tabela usada em importar-leads-maxwork-json.mjs — manter em sincronia.
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

// Excel guarda datas como nº de dias desde 1899-12-30 (inclui o bug do
// ano bissexto do Lotus 1-2-3, daí a base ser 30 e não 31).
function excelParaISO(serial) {
  if (serial == null || Number.isNaN(Number(serial))) return null;
  const ms = Math.round((Number(serial) - 25569) * 86400 * 1000);
  return new Date(ms).toISOString();
}

// Números de 9 dígitos a começar por 9 são claramente PT sem indicativo.
// O resto fica tal como veio — não vale a pena adivinhar indicativos
// estrangeiros.
function normalizarTelefone(tel) {
  if (!tel) return null;
  const limpo = String(tel).trim();
  if (/^9\d{8}$/.test(limpo)) return `+351${limpo}`;
  return limpo || null;
}

async function main() {
  const wb = xlsx.readFile(caminho);
  const linhas = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
    defval: null,
  });

  console.log(`${linhas.length} linhas no ficheiro.`);

  const refsImoveis = [
    ...new Set(linhas.map((l) => l["Imóvel"]).filter(Boolean)),
  ];
  const { data: imoveis } = refsImoveis.length
    ? await supabase.from("imoveis").select("id, ref_remax").in("ref_remax", refsImoveis)
    : { data: [] };
  const idImovelPorRef = new Map((imoveis ?? []).map((i) => [i.ref_remax, i.id]));

  const paraInserir = linhas.map((linha) => ({
    id_externo: String(linha["Id"]),
    origem: mapearOrigem(linha["Origem"]),
    nome: linha["Nome Lead"] || null,
    telefone: normalizarTelefone(linha["Telemóvel_1"]),
    email: linha["Email_1"] || null,
    mensagem: linha["Comentários"] || null,
    imovel_id: idImovelPorRef.get(linha["Imóvel"]) ?? null,
    consultor_id: null, // a maioria dos consultores ainda não tem conta — ver CLAUDE.md secção 8
    estado: mapearEstado(linha["Estado"]),
    criado_em: excelParaISO(linha["Data criação no Maxwork"]) ?? new Date().toISOString(),
  }));

  // ignoreDuplicates: false — este ficheiro tem mensagem (Comentários),
  // o export em massa não tem. Corrido depois do lote grande, atualiza
  // em vez de ignorar, para enriquecer os registos já existentes.
  const { data: inseridos, error } = await supabase
    .from("leads")
    .upsert(paraInserir, { onConflict: "id_externo", ignoreDuplicates: false })
    .select("id");

  if (error) {
    console.error("Erro ao importar:", error.message);
    process.exit(1);
  }

  console.log(`Importação concluída. ${inseridos?.length ?? 0} leads novas gravadas (duplicados ignorados).`);
}

main();
