# API do portal RE/MAX — como funciona

Descoberto em Ago 2026 por inspeção do próprio site. É uma API pública, sem chave, usada pelo remax.pt para desenhar as suas páginas de pesquisa.

## Endpoint

```
POST https://www.remax.pt/api/Listing/PaginatedMultiMatchSearch
Content-Type: application/json
```

### Corpo — carteira da RE/MAX Radial

```json
{
  "page": 1,
  "pageSize": 200,
  "filters": [
    { "field": "officeNumber", "operationType": "int", "operator": "=", "value": "12116" }
  ]
}
```

Devolve **93 registos** (87 ativos/reservados + 6 fechados recentemente).

### Notas importantes sobre os filtros

- **`officeNumber` é o número da agência (12116). `officeID` é outra coisa** — uma chave interna. Filtrar por `officeID=12116` devolve zero.
- `filters` tem de ser um **array**. Passar um objeto devolve 400.
- `operator` tem de ser `"="`. Com `"=="` o filtro é ignorado em silêncio e devolve o país inteiro — cuidado, é um falso positivo perigoso.
- `value` é sempre **string**, mesmo com `operationType: "int"`. Passar número dá 400.
- Sem filtros, devolve a rede nacional: ~45 800 imóveis para venda, ~49 000 no total.

### CORS

A chamada **tem de partir de um contexto com origem `remax.pt`** ou de um servidor. Do browser, a partir de `remaxradial.pt`, é bloqueada pela política de origem cruzada. Em produção: chamar a partir de um Worker/rota de servidor, com cache.

---

## Campos úteis na resposta

| Campo | Notas |
|---|---|
| `listingTitle` | A referência, ex. `121161162-32`. **A parte antes do hífen é o `agentID`** — permite atribuir o imóvel ao consultor sem mais nada. |
| `listingStatusID` | `1` Em mercado · `2` Reservado · `4` Vendido · `6` Arrendado |
| `businessTypeID` | `1` venda · `2` arrendamento |
| `typologyID` | Segue `2 × numberOfBedrooms + 1`. `null` em terrenos, lojas, armazéns. Preferir `numberOfBedrooms`. |
| `listingPrice`, `previousPrice` | Preço atual e anterior. `previousPrice > listingPrice` = houve redução. |
| `priceReductionPercentageValue`, `lastPriceReductionDate` | Histórico de redução. |
| `contractDate` | **Data da angariação.** Presente em todos. É a base do funil de negócios. |
| `marketDays` | Dias no mercado segundo o portal. |
| `latitude`, `longitude`, `coordinates` | Coordenadas por imóvel — é o que torna possível o desenho de área no mapa. |
| `regionName1..4` | Distrito, concelho, freguesia, zona. |
| `regionSearch2..4` | As mesmas, já em formato de URL. |
| `totalArea`, `livingArea`, `lotSize`, `builtArea`, `exteriorPrivateArea` | Áreas. |
| `numberOfBedrooms`, `numberOfWC`, `numberOfBathrooms`, `totalRooms` | Divisões. |
| `parking`, `garage`, `elevator`, `electricCarsCharging` | Atributos. |
| `energeticSpecification` | Certificado energético. |
| `userName`, `userCellPhone`, `agentID` | Consultor responsável. |
| `isExclusive` | Angariação em exclusivo. |
| `zipCode`, `address`, `publicAddress` | Morada. `publicAddress` diz se pode ser mostrada. |

> Há um campo truncado na leitura original que parece ser o ano de construção. **Confirmar** antes de o prometer na ferramenta de pesquisa.

---

## URLs dos anúncios

```
https://www.remax.pt/pt/imoveis/{slug}/{referencia}
```

O portal **resolve pela referência** — o slug é cosmético e qualquer valor funciona (`/pt/imoveis/x/121161162-32` devolve a página certa, com 200). Ainda assim, gerar o slug correto para SEO e para o utilizador:

```
{venda|arrendamento}-{tipo}-{t + nºquartos}-{regionSearch2}-{regionSearch3}
```

Ex.: `venda-apartamento-t2-odivelas-odivelas/121161162-32`

---

## Contagem que bate certo com o portal

O site anuncia 73 para comprar e 14 para arrendar. Para reproduzir:

```
excluir listingStatusID em (4, 6)   →  87 registos: 73 venda + 14 arrendamento
```

Ou seja, **os estados 4 e 6 são fechados** e o portal ainda os mostra durante algum tempo. O portal só guarda os fechos recentes — o histórico só se acumula a partir de snapshots próprios.

---

## Estratégia de armazenamento

45 mil imóveis guardados todos os dias enchem o plano gratuito do Supabase em semanas.

- Guardar o **estado atual** de todos os imóveis (uma linha por imóvel, atualizada).
- Guardar um **registo de alterações** apenas do que mudou: preço, estado, entradas e saídas.
- Passa de dezenas de milhares de linhas por dia para algumas centenas, sem perder nada do que interessa para estudos de mercado ou para o funil.
