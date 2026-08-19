-- tipo_imovel (apartamento, moradia, loja, terreno, armazém...) vem de
-- descriptionTags, que a API não documentava mas confirmámos em produção.
alter table imoveis add column tipo_imovel text;
create index imoveis_tipo_imovel_idx on imoveis (tipo_imovel);
