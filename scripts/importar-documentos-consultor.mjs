// Cria o bucket "documentos-consultor" (privado) e envia os documentos
// úteis para consultores, com metadados em documentos_consultor.
//
// Uso: node --env-file=.env.local scripts/importar-documentos-consultor.mjs

import { readFileSync, readdirSync } from "node:fs";
import { extname } from "node:path";
import { createClient } from "@supabase/supabase-js";

const BASE = "C:/Users/gunga/Desktop/Radial/Documentos para Consultores";
const BUCKET = "documentos-consultor";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

function semAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// "pista" é uma sub-string sem acentos para encontrar o ficheiro real na
// pasta (evita comparar nomes exatos — o Windows normaliza Unicode de
// forma diferente da que se escreve à mão num script).
const DOCUMENTOS = [
  { pasta: "en", pista: "BRANQUEAMENTO-COLECTIVAS-INGLES", nome: "Branqueamento de Capitais — Coletivas", categoria: "Branqueamento de Capitais", idioma: "en" },
  { pasta: "en", pista: "BRANQUEAMENTO-INDIVIDUAL-INGLES", nome: "Branqueamento de Capitais — Individual", categoria: "Branqueamento de Capitais", idioma: "en" },
  { pasta: "en", pista: "CONTRATO EXCLUSIVO DE CLIENTE COMPRADOR - EN", nome: "CMI — Contrato Exclusivo Cliente Comprador", categoria: "Contratos", idioma: "en" },
  { pasta: "en", pista: "CMI-EN (editavel)", nome: "CMI (editável)", categoria: "Contratos", idioma: "en" },
  { pasta: "en", pista: "CMI-EN-EXCLUSIVO DE REDE", nome: "CMI — Exclusivo de Rede", categoria: "Contratos", idioma: "en" },
  { pasta: "en", pista: "Proposta - Modelo 2", nome: "Proposta — Modelo 2", categoria: "Propostas e Vendas", idioma: "en" },
  { pasta: "en", pista: "Relatorio Visita imovel", nome: "Relatório de Visita ao Imóvel", categoria: "Visitas", idioma: "pt_en" },

  { pasta: "pt", pista: "ADENDA AO.CMI-MaisImoveis", nome: "Adenda ao CMI — Mais Imóveis", categoria: "Contratos", idioma: "pt" },
  { pasta: "pt", pista: "Aditamento ao CMI - Preco", nome: "Aditamento ao CMI — Preço", categoria: "Contratos", idioma: "pt" },
  { pasta: "pt", pista: "ANEXO CMI MAIS ASSINATURAS", nome: "Anexo CMI — Mais Assinaturas", categoria: "Contratos", idioma: "pt" },
  { pasta: "pt", pista: "Checklist Angariacao e Venda", nome: "Checklist — Angariação e Venda", categoria: "Angariação", idioma: "pt" },
  { pasta: "pt", pista: "CONTRATO EXCLUSIVO DE CLIENTE COMPRADOR.", nome: "CMI — Contrato Exclusivo Cliente Comprador", categoria: "Contratos", idioma: "pt" },
  { pasta: "pt", pista: "CMI-PT-EMPRESAS", nome: "CMI — Empresas", categoria: "Contratos", idioma: "pt" },
  { pasta: "pt", pista: "CONDICOES DE VENDA ATRAVES DE PROPOSTAS MULTIPLAS", nome: "Condições de Venda — Propostas Múltiplas", categoria: "Propostas e Vendas", idioma: "pt" },
  { pasta: "pt", pista: "Escala de Agosto", nome: "Escala de Agosto", categoria: "Escalas", idioma: "pt" },
  { pasta: "pt", pista: "Ficha Angariacao Habitacao", nome: "Ficha de Angariação — Habitação", categoria: "Angariação", idioma: "pt" },
  { pasta: "pt", pista: "Ficha Branquamento de Capitais", nome: "Ficha — Branqueamento de Capitais", categoria: "Branqueamento de Capitais", idioma: "pt" },
  { pasta: "pt", pista: "Ficha de Angariacao 2 folhas", nome: "Ficha de Angariação — 2 folhas", categoria: "Angariação", idioma: "pt" },
  { pasta: "pt", pista: "Licenca AMI Radial", nome: "Licença AMI — Radial", categoria: "Institucional", idioma: "pt" },
  { pasta: "pt", pista: "Mandato de Comprador", nome: "Mandato de Comprador", categoria: "Contratos", idioma: "pt" },
  { pasta: "pt", pista: "Proposta Modelo 2 Editavel", nome: "Proposta — Modelo 2 (editável)", categoria: "Propostas e Vendas", idioma: "pt" },
];

async function garantirBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets?.some((b) => b.name === BUCKET)) return;
  const { error } = await supabase.storage.createBucket(BUCKET, { public: false });
  if (error) throw error;
  console.log(`Bucket "${BUCKET}" criado.`);
}

function chaveStorageSegura(nome, extensao) {
  const semAcento = semAcentos(nome);
  const slug = semAcento
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug}.${extensao}`;
}

async function main() {
  await garantirBucket();

  const pastaEN = `${BASE}/Documentos em Inglês`;
  const pastaPT = `${BASE}/Documentos em Português`;
  const ficheirosEN = readdirSync(pastaEN);
  const ficheirosPT = readdirSync(pastaPT);

  for (const doc of DOCUMENTOS) {
    const listaFicheiros = doc.pasta === "en" ? ficheirosEN : ficheirosPT;
    const pastaCaminho = doc.pasta === "en" ? pastaEN : pastaPT;
    const pistaSemAcento = semAcentos(doc.pista).toLowerCase();

    const ficheiroReal = listaFicheiros.find((f) =>
      semAcentos(f).toLowerCase().includes(pistaSemAcento),
    );

    if (!ficheiroReal) {
      console.error(`Não encontrado na pasta "${doc.pasta}": pista "${doc.pista}"`);
      continue;
    }

    const extensao = extname(ficheiroReal).slice(1);
    const caminhoStorage = `${doc.pasta}/${chaveStorageSegura(doc.nome, extensao)}`;
    const conteudo = readFileSync(`${pastaCaminho}/${ficheiroReal}`);

    const { error: erroUpload } = await supabase.storage
      .from(BUCKET)
      .upload(caminhoStorage, conteudo, { upsert: true });

    if (erroUpload) {
      console.error(`Falhou o upload de "${doc.nome}":`, erroUpload.message);
      continue;
    }

    const { error: erroInsert } = await supabase
      .from("documentos_consultor")
      .upsert(
        {
          nome: doc.nome,
          categoria: doc.categoria,
          idioma: doc.idioma,
          caminho_storage: caminhoStorage,
          extensao,
        },
        { onConflict: "caminho_storage" },
      );

    if (erroInsert) {
      console.error(`Falhou o registo de "${doc.nome}":`, erroInsert.message);
      continue;
    }

    console.log(`OK: ${doc.nome} (${doc.idioma}) ← ${ficheiroReal}`);
  }

  console.log("Concluído.");
}

main();
