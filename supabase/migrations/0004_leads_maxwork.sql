-- Suporte à importação de leads do MAXWORK — ver docs/decisoes.md.
-- "CasaYes" apareceu numa exportação real e não estava previsto.
alter type origem_lead add value if not exists 'casayes';

-- id_externo identifica a lead na origem (ex: Id do MAXWORK), para a
-- importação poder ser corrida várias vezes sem duplicar leads.
alter table leads add column id_externo text;
create unique index leads_id_externo_idx on leads (id_externo) where id_externo is not null;
