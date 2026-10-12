-- "As minhas leads" — notas de acompanhamento do consultor. "Em atraso"
-- não precisa de campo próprio: calcula-se a partir de atualizado_em
-- (decisão do cliente, 24 Ago 2026 — 48h sem atividade e estado ainda
-- aberto conta como atraso). Cada atualização de estado/notas tem de
-- atualizar atualizado_em explicitamente (não há trigger).

alter table leads add column notas text;
