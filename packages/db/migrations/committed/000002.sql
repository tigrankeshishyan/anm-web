--! Previous: sha1:337f0f2e7355cd0473642a709d620414d7eef3e2
--! Hash: sha1:194ba0bb288a1065b6fa36553b90b3093d3f6238

create or replace function app_private.generate_sitemap()
  returns trigger
  security definer set search_path to app_public 
  language plpgsql as
$$
declare
  suffix text = tg_argv[0];
begin
  perform graphile_worker.add_job(
    'generateSitemap',
    payload := json_build_object('suffix', suffix),
    run_at := now() + interval '2 Minutes',
    job_key := 'generate-sitemap-' || suffix
    );
  if tg_op = 'delete' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists "generate_news_sitemap" on articles;
create trigger "generate_news_sitemap"
  after insert or delete on articles
  for each row execute procedure generate_sitemap('news');

drop trigger if exists "generate_musicians_sitemap" on musicians;
create trigger "generate_musicians_sitemap"
  after insert or delete on musicians
  for each row execute procedure generate_sitemap('musicians');

drop trigger if exists "generate_scores_sitemap" on scores;
create trigger "generate_scores_sitemap"
  after insert or delete on scores
  for each row execute procedure generate_sitemap('scores');
