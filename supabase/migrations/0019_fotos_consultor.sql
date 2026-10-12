-- Fotos de perfil dos consultores, usadas nos templates de marketing para
-- redes sociais (ver src/lib/templates-marketing.ts). Cada consultor pode
-- substituir a sua a qualquer momento — ver policies de storage abaixo.

alter table consultores add column foto_url text;

insert into storage.buckets (id, name, public)
values ('fotos-consultor', 'fotos-consultor', true)
on conflict (id) do nothing;

create policy "público vê fotos de consultor"
  on storage.objects for select
  to public
  using (bucket_id = 'fotos-consultor');

create policy "consultor carrega a própria foto"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'fotos-consultor');

create policy "consultor substitui a própria foto"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'fotos-consultor' and owner = auth.uid());

create policy "consultor apaga a própria foto"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'fotos-consultor' and owner = auth.uid());

-- Semente: fotos já existentes no site atual (radial.pt/team.php), otimizadas
-- e guardadas em public/consultores/. Só atualiza quem já tiver conta no
-- painel (nome coincide) — não-correspondências não fazem nada (seguro).
-- Isabel Santos ficou de fora: a foto no site atual é um avatar genérico,
-- não uma fotografia real.
update consultores set foto_url = '/consultores/adriana-rebelo.webp' where lower(trim(nome)) = lower('Adriana Rebelo');
update consultores set foto_url = '/consultores/carminda-batista.webp' where lower(trim(nome)) = lower('Carminda Batista');
update consultores set foto_url = '/consultores/conceicao-vieira.webp' where lower(trim(nome)) = lower('Conceição Vieira');
update consultores set foto_url = '/consultores/daniel-santa.webp' where lower(trim(nome)) = lower('Daniel Santa');
update consultores set foto_url = '/consultores/deolinda-fernandes.webp' where lower(trim(nome)) = lower('Deolinda Fernandes');
update consultores set foto_url = '/consultores/diogo-costa.webp' where lower(trim(nome)) = lower('Diogo Costa');
update consultores set foto_url = '/consultores/filipa-sousa.webp' where lower(trim(nome)) = lower('Filipa Sousa');
update consultores set foto_url = '/consultores/gracinda-carvalho.webp' where lower(trim(nome)) = lower('Gracinda Carvalho');
update consultores set foto_url = '/consultores/helena-silva.webp' where lower(trim(nome)) = lower('Helena Silva');
update consultores set foto_url = '/consultores/ismina-carimo.webp' where lower(trim(nome)) = lower('Ismina Carimo');
update consultores set foto_url = '/consultores/jacinta-da-silva.webp' where lower(trim(nome)) = lower('Jacinta da Silva');
update consultores set foto_url = '/consultores/jorge-valente.webp' where lower(trim(nome)) = lower('Jorge Valente');
update consultores set foto_url = '/consultores/jose-marta.webp' where lower(trim(nome)) = lower('José Marta');
update consultores set foto_url = '/consultores/maria-jose-simoes.webp' where lower(trim(nome)) = lower('Maria José Simões');
update consultores set foto_url = '/consultores/miguel-de-souza-barriga.webp' where lower(trim(nome)) = lower('Miguel de Souza Barriga');
update consultores set foto_url = '/consultores/natercia-ferreira.webp' where lower(trim(nome)) = lower('Natércia Ferreira');
update consultores set foto_url = '/consultores/nelson-timoteo.webp' where lower(trim(nome)) = lower('Nelson Timóteo');
update consultores set foto_url = '/consultores/nuno-cruz.webp' where lower(trim(nome)) = lower('Nuno Cruz');
update consultores set foto_url = '/consultores/paulo-pimpao.webp' where lower(trim(nome)) = lower('Paulo Pimpão');
update consultores set foto_url = '/consultores/pinto-lopes.webp' where lower(trim(nome)) = lower('Pinto Lopes');
update consultores set foto_url = '/consultores/samuel-lopes.webp' where lower(trim(nome)) = lower('Samuel Lopes');
update consultores set foto_url = '/consultores/sergio-fernandes.webp' where lower(trim(nome)) = lower('Sérgio Fernandes');
update consultores set foto_url = '/consultores/susana-aleixo.webp' where lower(trim(nome)) = lower('Susana Aleixo');
update consultores set foto_url = '/consultores/susana-lopes.webp' where lower(trim(nome)) = lower('Susana Lopes');
update consultores set foto_url = '/consultores/telmo-gomes.webp' where lower(trim(nome)) = lower('Telmo Gomes');
update consultores set foto_url = '/consultores/vitor-pimpao.webp' where lower(trim(nome)) = lower('Vitor Pimpão');
