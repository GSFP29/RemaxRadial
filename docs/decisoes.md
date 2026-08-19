# Decisões e as razões por trás delas

Cada uma destas foi discutida com o cliente. O objetivo deste ficheiro é não as reabrir por esquecimento.

---

## Alojamento: Cloudflare, não Vercel

O plano Hobby da Vercel proíbe explicitamente uso comercial nos termos de utilização. Um site de mediação imobiliária cai nessa definição. O Pro custa 20 USD/utilizador/mês.

A Cloudflare (Pages + Workers) **não tem essa restrição** e o plano gratuito dá 100 000 pedidos/dia e 500 publicações/mês — folgadíssimo para uma agência em Odivelas.

**Decisão:** começar a custo zero. Definir gatilhos para pagar em vez de decidir por receio:

| Gatilho | Ação | Custo |
|---|---|---|
| Haver leads reais na base de dados | Supabase Pro, pelos backups diários | 25 USD/mês |
| Passar 100 000 pedidos/dia | Cloudflare Workers Paid | 5 USD/mês |
| Cansar-se de gerir a montagem | Vercel Pro | 20 USD/mês |

O primeiro é o importante: **o plano gratuito do Supabase não tem backups.** Perder a base de leads não é recuperável.

Nota factual corrigida: a suspensão do Supabase no plano gratuito é ao fim de **uma semana sem atividade nenhuma**. Um site com visitantes nunca fica inativo, portanto o plano gratuito serve para produção a esta escala (500 MB, 50 000 utilizadores/mês, 1 GB de ficheiros).

---

## GitHub Pages: não serve

Serve apenas ficheiros estáticos. Sem servidor, não há login, não há base de dados, não há como guardar formulários, e a chamada à API RE/MAX é bloqueada por CORS a partir de outro domínio. Além disso os termos do GitHub proíbem usar o Pages para alojar um negócio online.

**O GitHub continua a ser central — como repositório do código.** Alojar é outro serviço.

---

## Nada de scrapers

Não construir extração automática contra **idealista, Imovirtual, Facebook, CASAFARI** ou sites de agências concorrentes. Três razões, por ordem de gravidade para o cliente:

1. **Direito *sui generis* de bases de dados (UE).** Uma base de anúncios está protegida por direito próprio, independente dos termos de utilização. Extrair partes substanciais é exposição jurídica autónoma.
2. **RGPD.** Anúncios de particulares trazem nome e telemóvel. Construir uma base de proprietários para prospeção é o caso de uso que os reguladores conhecem — e seria feito por uma **empresa de mediação licenciada**, com o AMI em risco.
3. **Não funcionaria.** Estes portais correm sistemas comerciais anti-robô. Um scraper caseiro dura dias ou semanas.

**Nuance registada:** ler alguns anúncios do site de uma agência é diferente de extrair 15 redes todos os dias. Escala e sistematicidade são o critério — a segunda não é defensável.

**Alternativa aprovada:** o "lançador de pesquisas" — o consultor introduz os critérios uma vez e a ferramenta abre a pesquisa já filtrada nos sites que ele visitaria de qualquer forma, lado a lado. Não guarda nada, não copia nada, e resolve o problema real (repetir filtros oito vezes por cliente).

---

## Fontes de dados legítimas

| Fonte | O que dá | Custo | Estado |
|---|---|---|---|
| API portal RE/MAX | 45k imóveis, coordenadas, atributos, preços | 0 € | **A funcionar** |
| INE — Estatísticas de Preços da Habitação ao nível local | preço mediano/m² por freguesia, base fiscal, trimestral | 0 € | Por integrar |
| Histórico da própria Radial | 2 164 preços de **fecho** reais | 0 € | Extraído |
| idealista Search API | anúncios do idealista | pedido de acesso | Não pedido |
| CASAFARI Property Data API | 60M imóveis, 30k fontes, histórico e comparáveis | a negociar | **Em aberto** |
| Confidencial Imobiliário (SIR / Micro-SIR) | transações georreferenciadas | pago | Alternativa |
| eGO MLS / Sync MLS | partilha formal entre agências | a consultar | Alternativa |

Preços de **anúncio** são fonte fraca — 60% das vendas fecham abaixo do pedido. Preços de **transação** (INE, Micro-SIR, histórico próprio) são o que sustenta um estudo credível.

---

## Dois funis, não um

**Funil de Leads Digitais** — só portais e formulários. Nunca serve para comparar consultores: quem trabalha por telefone e referência aparece injustamente em baixo, e isso mata a adoção da ferramenta. O aviso está escrito na própria interface e deve manter-se.

**Funil de Negócios** — construído a partir do portal RE/MAX, 100% automático, sem input humano. Cobre a agência inteira independentemente da origem da lead.

A razão: a maioria dos contactos entra diretamente no telemóvel do consultor, são centenas por dia, e registá-los um a um é inviável. Não desenhar nada que dependa disso. O topo do funil telefónico fica por cobrir e **isso é aceitável desde que esteja rotulado**.

---

## Privacidade e acessos

- Regras de acesso na base de dados (RLS), não no frontend.
- Consultor vê os seus imóveis e leads; os dos colegas em leitura.
- **Histórico de pesquisas de mercado é privado por consultor. O administrador tem a ferramenta mas não os históricos.** Decisão explícita do cliente — é o que faz a equipa confiar em vez de contornar.
- Dados pessoais de clientes nunca em dashboards partilháveis, exports ou artefactos.
- O ficheiro mestre atual tem nome, telefone, email e morada de milhares de clientes numa folha de cálculo sem proteção. Migrar para base de dados com acessos é também uma correção de RGPD.

---

## Credenciais

**Nunca aceitamos palavras-passe do cliente nem as escrevemos em campos de login.** A extração de plataformas autenticadas (MAXWORK) faz-se no **browser do próprio utilizador, com a sessão que ele já iniciou**. A palavra-passe nunca passa por nós.

Consequência prática: extração **assistida** (o utilizador entra, nós extraímos a seguir) funciona sempre. Extração **automática sem ele** só funciona se a sessão sobreviver — a testar.

---

## Design

- **Cores institucionais (Ago 2026, atualizado a pedido do cliente):** seguem o color building system da RE/MAX — branco como cor principal, vermelho e azul como apontamentos, cores sólidas (não gradientes). Valores confirmados a partir do logótipo real da agência: vermelho `#c8102e`, azul `#0033a0`. A decisão anterior de navy `#003a6b` como cor institucional única fica revogada.
- Séries de gráficos: `#2a78d6` `#eb6834` `#1baf7a` `#eda100` — ordem fixa, nunca ciclada, validada para daltonismo. Ficam à parte da identidade de marca por serem uma decisão de acessibilidade, não estética.
- **Modo escuro removido (Ago 2026).** O cliente pediu explicitamente modo claro forçado em todo o site — "fica mais profissional". Isto revoga a decisão anterior ("modo escuro selecionado, não invertido") registada mais abaixo por referência histórica. Não construir nenhuma alternativa escura, nem no site público nem no painel interno, a menos que o cliente peça de volta.
- Superfície clara `#ffffff`, texto `#0b0b0b`, secundário `#52514e`, grelha `#e1e0d9`.
- Nunca gráficos de dois eixos verticais.
- Cada métrica aparece ao lado da sua referência histórica.

---

## Aplicação instalável: PWA, não nativa

O cliente quis que os consultores pudessem instalar a ferramenta no telemóvel e no computador. **Decisão: PWA.**

**Porquê não nativa:**

- Seriam **duas aplicações a mais para manter** além da web — ou uma terceira base de código se se usasse React Native/Flutter. Para 28 utilizadores internos, a economia nunca fecha.
- **Conta de programador Apple: 99 USD/ano** (299 no programa Enterprise). Google Play: 25 USD uma vez.
- **A App Store rejeita invólucros de sites.** A regra 4.2 (*Minimum Functionality*) exige que a app "eleve-se acima de um site reempacotado", e a 4.2.2 proíbe expressamente apps que sejam sobretudo *web clippings* ou coleções de links. Uma app que é o nosso site dentro de uma moldura é rejeitada — é uma armadilha clássica.
- **Cada alteração passaria a exigir versão e revisão.** Hoje publicamos a cada commit.

**O que a PWA dá, e chega:**

- Instala-se do browser no Android, no iOS e no computador; ganha ícone e abre sem barra de endereço
- Funciona offline no que estiver em cache
- **Notificações push, incluindo no iOS** — o Safari suporta Web Push desde a versão 16.4 para PWA adicionada ao ecrã principal
- Atualiza-se sozinha; ninguém tem de instalar nada outra vez
- Custo adicional: **zero**

**Limitação conhecida:** no iOS a instalação é feita pelo Safari, em *Partilhar → Adicionar ao ecrã principal*, e não é óbvia para toda a gente. Mitigação: uma página curta de instruções com capturas de ecrã, e um código QR afixado na agência.

**Quando reconsiderar nativa:** só se aparecer necessidade real de integração com o sistema operativo — localização em segundo plano, por exemplo. Consultar imóveis e leads não é isso.

**Desenho móvel:** a versão de telemóvel não é o painel encolhido. São quatro coisas — consultar um imóvel depressa, ver as minhas leads e a próxima ação, registar o resultado de uma visita, e os contactos de parceiros.

---

## Novos separadores da área de consultor (Ago 2026)

Pedidos pelo cliente e registados no `CLAUDE.md`, secção 9:

- **Contactos de parceiros** — gráficas, solicitadores, advogados, notários, certificação energética, fotografia, arquitetos, intermediários de crédito, limpezas, mudanças, obras. Por categoria, com condições negociadas. Mantido pelo administrador. É barato de construir e dos que mais tempo poupa.
- **Marcação de salas de reunião** — calendário partilhado com reserva por consultor, hora e cliente associado.

A estrutura de separadores deve permitir acrescentar outros sem refazer a navegação — vão surgir mais.
