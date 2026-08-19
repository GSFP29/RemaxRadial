# RE/MAX Radial — plataforma interna e site público

Contexto permanente do projeto. Lê isto ao início de cada sessão.
Detalhe técnico nos ficheiros de `docs/`. Não os leias todos de uma vez — vai ao que precisares.

---

## 1. Quem é o cliente

**RE/MAX Radial**, agência n.º **12116**, em Odivelas. 22 anos de atividade, ~28 consultores.
Interlocutor: **Paulo Pimpão**. Fala-se e escreve-se **português de Portugal** — interface, conteúdos, commits e comentários.

Carteira atual (Ago 2026): **87 angariações ativas** — 73 venda, 14 arrendamento. ~29,3 M€ em valor pedido.

---

## 2. O que estamos a construir

**Uma aplicação, três portas.**

| Porta | Quem entra | O que vê |
|---|---|---|
| Público | qualquer pessoa, **sem login nenhum** | site institucional, imóveis, simulador de avaliação, recrutamento, contactos |
| Consultor | login | os seus imóveis e leads, os dos colegas em leitura, ferramenta de pesquisa de mercado |
| Administrador | login | tudo o acima + funis, métricas, gestão de utilizadores, marketing |

**Regra crítica:** o cliente final **nunca** vê um botão de login, nem modo convidado, nem nada. O site público é um site normal. A área privada vive em rotas próprias (`/painel` ou subdomínio `painel.remaxradial.pt`).

Domínio **remaxradial.pt** — a agência controla-o. O site atual é um template PHP da rede RE/MAX e vai ser substituído.

---

## 3. Stack e alojamento

Decidido, com razões em `docs/decisoes.md`:

- **Código:** GitHub, repositório privado
- **Alojamento:** **Cloudflare** Pages/Workers — *não* Vercel
- **Base de dados / auth / storage:** **Supabase** (Postgres + Row Level Security)
- **Mapas:** Leaflet + plugin de desenho de polígono (aberto, gratuito)

> ⚠️ **Nunca usar o plano Hobby da Vercel.** É explicitamente proibido para uso comercial nos termos deles. Se algum dia se for para Vercel, é Pro.

**Permissões:** as regras de acesso vivem na base de dados (RLS), **não** no frontend. Um bug no ecrã não pode expor dados de outro consultor.

---

## 4. As quatro torneiras de dados

O painel **lê sempre a nossa base de dados**, nunca consulta sistemas externos ao vivo. Um servidor não tem — nem deve ter — a sessão do utilizador em plataformas de terceiros.

1. **Portal RE/MAX** — API pública, funciona hoje. Ver `docs/api-remax.md`. É a fonte dos imóveis e do funil de negócios.
2. **Emails dos portais** (idealista, Imovirtual, portal RE/MAX) — parsing de email para criar leads. Script de arranque em `docs/decisoes.md`.
3. **MAXWORK** — plataforma interna da RE/MAX (`app.maxwork.pt`). É onde caem as leads. **Por resolver** — ver secção 8.
4. **Formulários do site** — avaliação, recrutamento, contacto.

---

## 5. Guardrails — decisões já tomadas, não reabrir sem falar com o cliente

**Não construir scrapers** contra idealista, Imovirtual, Facebook, CASAFARI ou sites de agências concorrentes. Motivos em `docs/decisoes.md` (direito *sui generis* de bases de dados na UE, RGPD sobre anúncios de particulares, e fragilidade técnica). Isto foi discutido e decidido — se uma sessão futura for tentada a resolver um problema de dados com um scraper, a resposta é não.

**Não guardar contactos de proprietários particulares** recolhidos de anúncios. Uma ferramenta que ajuda o consultor a *encontrar* anúncios está bem; uma base de dados de números de telefone não.

**Dados pessoais de clientes** (nome, telefone, email, morada) nunca entram em dashboards partilháveis, exports ou artefactos. Só agregados.

**O funil de leads chama-se "Funil de Leads Digitais"** e só cobre portais e formulários. **Nunca usar para comparar consultores entre si** — quem trabalha por telefone e referência aparece injustamente em baixo, e isso mataria a adoção. Está escrito na própria interface e deve continuar.

**A maioria das leads chega por telemóvel direto do consultor** — centenas por dia — e é inviável registá-las uma a uma. Não desenhar nada que dependa disso.

---

## 6. Os números que servem de régua

Extraídos do registo mestre da agência (3 942 contratos, 2004–2026). Detalhe e proveniência em `docs/benchmarks.md`.

| | |
|---|---|
| Taxa de sucesso das angariações | **56,7%** |
| … venda | **49,7%** |
| … arrendamento | **76,2%** |
| Mediana até escriturar (venda) | **149 dias** |
| Mediana até fechar (arrendamento) | **29 dias** |
| Mediana até cancelar | **339 dias** |
| Vendas fechadas abaixo do pedido | **60%** (desconto mediano 2,6%) |
| Cancelamentos sem motivo registado | **36%** |

**Usa isto.** Qualquer métrica no painel deve aparecer ao lado da sua referência histórica — é o que transforma "está há 300 dias em carteira" numa afirmação com consequência.

Leitura que orienta o produto: metade das angariações de venda nunca chega a escritura, e o que se cancela fica 339 dias em carteira contra 149 do que se vende. **O problema da agência é preço e tempo de decisão, não falta de leads.**

---

## 7. Ordem de construção

1. **Fundação** — repositório, Cloudflare, Supabase, esquema de base de dados, auth com os três níveis e RLS.
2. **Site público** — institucional, imóveis puxados da API RE/MAX, **simulador de avaliação**, recrutamento. O simulador é a peça central: dá um valor a sério com base em comparáveis locais reais, e só depois pede o contacto.
3. **Captura de leads** — formulários do site a escrever direto na base; parsing dos emails dos portais.
4. **Área de consultor** — os seus imóveis, as suas leads, e a **ferramenta de pesquisa** (ver secção 9).
5. **Área de administrador** — funis, métricas, benchmarks, gestão.
6. **Prospeção e mercado** — a mais vaga, fica para o fim.

**Foco estratégico:** o site é para **proprietários e candidatos a consultor**, não para compradores. Compradores já são servidos pelo remax.pt e essa batalha não se ganha. Quem procura "quanto vale a minha casa em Odivelas" não é servido por ninguém — e é quem gera angariações.

---

## 8. Em aberto — perguntar antes de assumir

- **MAXWORK:** há botão de exportar? As leads chegam também por email? Quanto dura a sessão? Sem estas respostas não se desenha a integração. A extração faz-se sempre **no browser do utilizador, com a sessão dele** — nunca com credenciais nossas, que não aceitamos.
- **CASAFARI:** a subscrição é individual, não de agência. Está a decorrer pedido de upgrade e de acesso à Property Data API. **Não construir nada que dependa da CASAFARI** até haver resposta escrita sobre o âmbito da licença.
- **Email dos portais:** falta saber se a caixa é Google Workspace ou Microsoft 365 — decide a ferramenta de parsing.
- **Regras da marca RE/MAX** sobre site próprio e uso das angariações do portal: por confirmar. O cliente preferiu não envolver a RE/MAX por agora.

---

## 9. Área de consultor — o que tem lá dentro

Separadores acordados com o cliente:

**Os meus imóveis** — a carteira do próprio consultor, com estado, dias em carteira e alertas. Os dos colegas visíveis em modo leitura.

**As minhas leads** — funil pessoal, próximas ações, o que está em atraso.

**Pesquisa de mercado** — a ferramenta principal. Filtros ricos (ano de construção, áreas, quartos, casas de banho, tipologia, preço, certificado energético) e **delimitação de zona no mapa**, quer escrevendo o nome quer desenhando um polígono com pontos. Tem de ser rápido e intuitivo — usa-se com um cliente ao telefone.

> **Pesquisas guardadas:** cada consultor guarda pesquisas com um nome que identifica o cliente a que se destinam. **Um consultor não vê o histórico dos colegas. O administrador tem a ferramenta mas NÃO tem acesso aos históricos de pesquisa dos consultores.** Decisão explícita do cliente, importante para a confiança da equipa — não "otimizar" isto.

Fontes, por ordem: rede RE/MAX (45k imóveis, já acessível, e partilha dentro da rede é normal), INE para preços de transação por freguesia, histórico de fechos da própria Radial, e CASAFARI se e quando a licença o permitir.

**Contactos de parceiros** — diretório de fornecedores da agência: gráficas, solicitadores, advogados, notários, certificação energética, fotografia e vídeo, arquitetos, intermediários de crédito, limpezas, mudanças, obras. Por categoria, com contacto, condições negociadas e notas. Mantido pelo administrador, consultado por todos. É a coisa mais simples de construir de toda a área de consultor e das que mais poupa tempo no dia a dia.

**Marcação de salas de reunião** — calendário partilhado das salas da agência, com reserva por consultor, hora e cliente associado. Evita a conversa de corredor e o duplo agendamento.

Outros separadores a acrescentar conforme forem surgindo — a estrutura deve permitir isso sem refazer nada.

---

## 10. Aplicação para telemóvel e computador — decidido: PWA

O cliente quer que os consultores possam "instalar" a ferramenta. **A resposta é PWA (Progressive Web App), não aplicação nativa.** Razões em `docs/decisoes.md`.

Na prática: a mesma aplicação web, com manifesto e service worker. Instala-se a partir do browser no telemóvel e no computador, ganha ícone, abre sem barra de endereço, funciona offline no que estiver em cache e recebe notificações push (incluindo iOS, para PWA instalada). Zero custo adicional, zero lojas, zero versões a manter.

**Desenhar a versão móvel para quatro coisas, não para o painel encolhido:** consultar um imóvel depressa com um cliente à frente, ver as minhas leads e a próxima ação, registar o resultado de uma visita, e aceder aos contactos de parceiros. Tudo o resto é trabalho de secretária e vive no computador.

---

## 11. O que já existe

Entregue ao cliente nas sessões anteriores, para referência e para migrar:

- `RemaxRadial_Angariacoes.xlsx` — as 87 angariações com links
- `RemaxRadial_Funil_v2.xlsx` — folhas Leads + Angariações, listas fechadas, benchmarks
- `RemaxRadial_Dashboard_Funil.html` — funil de leads digitais
- `RemaxRadial_Funil_Negocios.html` — carteira e angariações, automático
- `RemaxRadial_Retrato_22Anos.html` — análise histórica
- Tarefa agendada diária que tira snapshot do portal para o Google Drive (pasta "RE-MAX Radial — Snapshots do Portal")

Estes ficheiros são o protótipo do que a aplicação vai substituir. As métricas e a linguagem deles devem ser preservadas.

---

## 12. Convenções

- **Idioma:** pt-PT em tudo o que o utilizador vê. Código e nomes de variáveis em inglês.
- **Moeda:** `Intl.NumberFormat('pt-PT', {style:'currency', currency:'EUR', useGrouping:'always'})`
- **Cores institucionais:** seguem o color building system da rede RE/MAX — branco como base, vermelho `#c8102e` e azul `#0033a0` como apontamentos (confirmado a partir do logótipo real da agência, Ago 2026). Cores sólidas, não gradientes. Séries de gráficos mantêm-se à parte, por acessibilidade: `#2a78d6`, `#eb6834`, `#1baf7a`, `#eda100` (validadas para daltonismo).
- **Modo claro forçado, sem exceções** (Ago 2026, decisão do cliente: "fica mais profissional"). **Revoga** a decisão anterior de modo escuro obrigatório — não construir alternativa escura em nenhuma área, incluindo o painel interno.
- **Datas** em ISO na base de dados, `dd/mm/aaaa` no ecrã.
- **Nunca** usar localStorage para dados de negócio — só base de dados.
