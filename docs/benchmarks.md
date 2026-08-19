# Benchmarks da agência — 22 anos

Extraídos do ficheiro **MAPA IMOVEIS EXISTENTES** (registo mestre da RE/MAX Radial, Jan 2004 – Ago 2026).
Duas folhas: *Imoveis Activos* (2 292 registos) e *Cancelados* (1 651 registos).

## Funil de angariação

| | |
|---|---|
| Contratos de mediação assinados | **3 942** |
| Chegaram a fechar | **2 164** (54,9%) |
| Cancelados | **1 651** (41,9%) |
| Ainda em carteira | **127** (3,2%) |
| **Taxa de sucesso** (fechados ÷ decididos) | **56,7%** |

Por tipo de negócio:

| | Fechados | Cancelados | Sucesso |
|---|---|---|---|
| Venda | 1 372 | 1 387 | **49,7%** |
| Arrendamento | 791 | 247 | **76,2%** |

## Tempo

| Desfecho | Mediana |
|---|---|
| Arrendamento fechado | **29 dias** |
| Venda fechada | **149 dias** |
| Cancelamento | **339 dias** |

**A leitura que importa:** o que se vende, vende-se em 149 dias. O que se cancela fica 339 dias em carteira antes de alguém desistir. São ~190 dias de trabalho por angariação que já tinha dado sinais.

## Preço

- **60%** das vendas fecham **abaixo** do preço pedido (350 negócios com os dois valores registados)
- Desconto mediano: **2,6%**
- Apenas 9 dos 93 imóveis da carteira atual alguma vez baixaram de preço

## Motivos de cancelamento

Categorizados a partir de texto livre. **36,3% não têm motivo registado** — a maior perda de informação do ficheiro, e a razão para a lista fechada de motivos no funil v2.

| Motivo | % dos cancelamentos |
|---|---|
| Sem motivo registado | 36,3% |
| Outro | 13,4% |
| Proprietário desistiu | 11,1% |
| Preço acima do mercado | 10,9% |
| Fim de prazo / regras do contrato | 10,7% |
| Sem procura / tempo esgotado | 9,4% |
| Resolveu-se fora da Radial | 3,3% |
| Perdido para outra agência | 2,8% |
| Situação jurídica / bancária | 2,1% |

`Cancelado por:` divide-se quase a meio — **cliente 505, Radial 441**. Metade dos cancelamentos é decisão da própria agência.

## Partilha

Dos 581 negócios com `vendido por` preenchido, **35% foram partilhados** com outra agência ou outra RE/MAX. Só 376 fecharam dentro da Radial. Amostra parcial — não extrapolar ao universo.

## Carteira atual (snapshot 17 Ago 2026)

84 em mercado · 3 reservados · 6 fechados recentes · 29,3 M€ em valor pedido · rendas mensais 25 k€
Idade mediana da carteira: **157 dias**
**24 imóveis com mais de 1 ano em carteira, 21 dos quais nunca baixaram de preço.**

## Ressalvas de qualidade dos dados

- **Coluna `Comissão €` não é utilizável** sem limpeza: mistura comissão total com comissão por fase e tem valores até 1,3 M€ ao lado de medianas de 5 000 €. Não construir análises sobre ela.
- **`Comissão %`** mistura convenções: `0.05` = 5% na venda, `1.5` = número de rendas no arrendamento, `fixa` = valor fechado.
- Nomes de consultores estão abreviados e inconsistentes (`Helena F.`, `Helena S.`, `Paulo P.`). Precisam de tabela de correspondência para cruzar com os nomes do portal.
- Uma data de contrato com o ano `0022` e um ID com duas referências na mesma célula. Validar à entrada.
