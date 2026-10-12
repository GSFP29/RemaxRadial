// Insere as avaliações reais do Google enviadas pelo cliente. Timestamps
// escalonados de propósito para controlar a ordem (a homepage ordena por
// criado_em desc) — a Joana Martins fica primeiro, como pedido.
//
// Uso: node --env-file=.env.local scripts/importar-avaliacoes.mjs

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const agora = Date.now();

// Ordem da lista = ordem de exibição (mais recente primeiro na homepage).
const AVALIACOES = [
  {
    nome_autor: "Joana Martins",
    texto:
      "Não classifico com mais estrelas porque não é possível! A Susana é uma excelente profissional, sempre disponível e muito simpática. Recomendo a Remax Radial para tornarem os vossos sonhos possíveis!",
    minutosAtras: 0,
  },
  {
    nome_autor: "Sara Maia",
    texto:
      "Foi graças à Susana Aleixo que encontrámos a casa ideal para nós. Sentimo-nos acompanhados em todo o processo e tornou-se tudo mais fácil",
    minutosAtras: 1,
  },
  {
    nome_autor: "Catarina Arcângelo",
    texto:
      "Não podíamos estar mais satisfeitos desde o primeiro dia com a Adriana Rebelo, a sua disponibilidade, amabilidade, sempre prestável, muito profissional e 5 estrelas, recomendamos muito",
    minutosAtras: 2,
  },
  {
    nome_autor: "Pedro Jorge",
    texto:
      "Mediação 5 estrelas. Acompanhamento muito próximo por parte do Nelson Timóteo, que nos ajudou a comprar o imóvel da melhor forma, com muita atenção e ajuda em todos os detalhes do processo da compra.",
    minutosAtras: 3,
  },
  {
    nome_autor: "Margarida Vaz",
    texto:
      "A compra da minha primeira casa, que é um passo muito desafiante, tornou-se muito mais fácil graças à minha agente imobiliária da Remax, Adriana Rebelo",
    minutosAtras: 4,
  },
];

const linhas = AVALIACOES.map((a) => ({
  nome_autor: a.nome_autor,
  texto: a.texto,
  estrelas: 5,
  criado_em: new Date(agora - a.minutosAtras * 60_000).toISOString(),
}));

const { error, data } = await supabase.from("avaliacoes_google").insert(linhas).select("nome_autor");

if (error) {
  console.error("Erro:", error.message);
  process.exit(1);
}

console.log(`Inseridas ${data.length} avaliações:`, data.map((d) => d.nome_autor).join(", "));
