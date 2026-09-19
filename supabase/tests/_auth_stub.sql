-- 로컬 Postgres용 Supabase auth 흉내. 실제 Supabase에는 적용하지 말 것.
create schema if not exists auth;
create table if not exists auth.users (id uuid primary key);
create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('app.uid', true), '')::uuid
$$;
