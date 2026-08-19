# Primeira sessão no Claude Code — por onde começar

## Antes de escrever código

1. Ler `CLAUDE.md`, depois `docs/decisoes.md`. Os outros ficheiros só quando forem precisos.
2. Confirmar com o cliente as quatro perguntas em aberto (secção 8 do `CLAUDE.md`). Em particular o MAXWORK — decide uma das quatro torneiras.

## Sequência sugerida

**Passo 1 — esqueleto e alojamento.** Repositório privado no GitHub, projeto Next.js (ou Astro se o site público pesar mais que a aplicação), publicação na Cloudflare, domínio ainda não apontado. Objetivo: uma página "em construção" no ar, publicada automaticamente a cada commit.

**Passo 2 — base de dados e autenticação.** Projeto Supabase, tabelas `consultores`, `imoveis`, `leads`, `pesquisas_guardadas`, e as políticas RLS dos três níveis. Testar com dois utilizadores que a política funciona *antes* de construir ecrãs por cima.

**Passo 3 — ingestão dos imóveis.** Rota de servidor que chama a API RE/MAX (ver `docs/api-remax.md`), escreve o estado atual e regista alterações. Correr uma vez por dia. `data/imoveis-snapshot.csv` serve de fixture para desenvolver sem chamar a API.

**Passo 4 — site público.** Institucional, listagem de imóveis a partir da base, páginas individuais. Renderizado no servidor, por causa do Google.

**Passo 5 — simulador de avaliação.** A peça que gera leads. Comparáveis vindos da base (rede RE/MAX + histórico da Radial). **Dar o valor primeiro, pedir o contacto depois** — converte muito melhor que o contrário, e distingue-nos dos simuladores que são só formulários disfarçados.

**Passo 6 — área de consultor** e a ferramenta de pesquisa com mapa.

**Passo 7 — área de administrador**, migrando as métricas dos protótipos HTML existentes.

## Ficheiros de dados incluídos

- `data/imoveis-snapshot.csv` — as 93 angariações da Radial em 17 Ago 2026, com estado, datas, preços e consultor. Fixture de desenvolvimento e ponto zero da série histórica.
- `data/consultores.csv` — correspondência `agentID` → nome → telemóvel. É o que permite atribuir automaticamente um imóvel ou uma lead ao consultor certo a partir da referência do anúncio.

## Uma nota sobre o que não fazer no primeiro dia

Não começar pela página de prospeção e análise de mercado. É a mais vaga das três, depende de fontes ainda por confirmar (CASAFARI, INE) e é a que mais facilmente consome semanas sem produzir nada visível. Fica para o fim, quando já houver dados próprios para lá pôr.
