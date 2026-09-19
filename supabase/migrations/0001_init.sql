-- Look At This — 1단계: 스키마 + 규칙(트리거) + 뷰 + RLS
create extension if not exists postgis;

-- ---------- 테이블 ----------
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  handle text unique not null check (handle ~ '^[a-z0-9_]{3,20}$'),
  lang text not null default 'en',
  slots int not null default 1,
  strikes int not null default 0,
  banned_until timestamptz,
  created_at timestamptz not null default now()
);

create table posts (
  id bigint generated always as identity primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  body text check (char_length(body) <= 1000),
  lang text not null,
  photo_path text not null,
  photo_hash text not null,
  geog geography(point, 4326) not null,
  accuracy_m int,
  loc_source text not null check (loc_source in ('gps', 'ip')),
  country text,
  city text,
  neighborhood text,
  region_key text not null default '',   -- 비면 트리거가 geohash5로 채움
  self_price_usd numeric(12, 2) check (self_price_usd >= 0),
  status text not null default 'active' check (status in ('active', 'hidden', 'rejected', 'deleted')),
  created_at timestamptz not null default now()
);
create index posts_geog_idx on posts using gist (geog);
create index posts_region_idx on posts (region_key, status);
create unique index posts_user_photo_idx on posts (user_id, photo_hash);

create table votes (
  post_id bigint not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  lang text not null,
  price_usd numeric(12, 2) check (price_usd >= 0),
  status text not null default 'active' check (status in ('active', 'hidden', 'deleted')),
  created_at timestamptz not null default now()
);
create index comments_post_idx on comments (post_id, status);

create table reports (
  id bigint generated always as identity primary key,
  reporter_id uuid references profiles(id) on delete set null,
  post_id bigint references posts(id) on delete cascade,
  comment_id bigint references comments(id) on delete cascade,
  reason text not null check (reason in ('adult', 'violence', 'spam', 'privacy', 'copyright')),
  created_at timestamptz not null default now(),
  check (post_id is not null or comment_id is not null)
);

create table translations (
  kind text not null check (kind in ('post', 'comment')),
  ref_id bigint not null,
  lang text not null,
  title text,
  body text,
  primary key (kind, ref_id, lang)
);

create table payments (
  id text primary key,                     -- 결제사 order id → 멱등
  user_id uuid not null references profiles(id),
  slots_added int not null check (slots_added > 0),
  amount_usd numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

-- ---------- 규칙 (DB에서 강제) ----------
-- 인벤토리 초과 차단 + region_key 기본값
create or replace function posts_before_insert() returns trigger language plpgsql as $$
begin
  if (select count(*) from posts where user_id = new.user_id and status = 'active')
     >= (select slots from profiles where id = new.user_id) then
    raise exception 'INVENTORY_FULL';
  end if;
  if new.region_key = '' then
    new.region_key := st_geohash(new.geog::geometry, 5);
  end if;
  return new;
end $$;
create trigger posts_before_insert before insert on posts
  for each row execute function posts_before_insert();

-- 신고 3건 누적 → 자동 숨김
create or replace function reports_auto_hide() returns trigger language plpgsql as $$
begin
  if new.post_id is not null
     and (select count(*) from reports where post_id = new.post_id) >= 3 then
    update posts set status = 'hidden' where id = new.post_id and status = 'active';
  end if;
  if new.comment_id is not null
     and (select count(*) from reports where comment_id = new.comment_id) >= 3 then
    update comments set status = 'hidden' where id = new.comment_id and status = 'active';
  end if;
  return new;
end $$;
create trigger reports_auto_hide after insert on reports
  for each row execute function reports_auto_hide();

-- 결제 반영: payments insert → slots 증가 (웹훅은 insert만 하면 됨)
create or replace function payments_add_slots() returns trigger language plpgsql as $$
begin
  update profiles set slots = slots + new.slots_added where id = new.user_id;
  return new;
end $$;
create trigger payments_add_slots after insert on payments
  for each row execute function payments_add_slots();

-- 사용자 본인 세션(auth.uid()=본인)은 slots/strikes/banned_until 변경 불가, 숨김/거부 상태 복구 불가
create or replace function profiles_guard() returns trigger language plpgsql as $$
begin
  if auth.uid() = old.id
     and (new.slots, new.strikes, new.banned_until) is distinct from (old.slots, old.strikes, old.banned_until) then
    raise exception 'FORBIDDEN_FIELD';
  end if;
  return new;
end $$;
create trigger profiles_guard before update on profiles for each row execute function profiles_guard();

create or replace function content_guard() returns trigger language plpgsql as $$
begin
  if auth.uid() = old.user_id
     and old.status in ('hidden', 'rejected') and new.status not in (old.status, 'deleted') then
    raise exception 'FORBIDDEN_STATUS';
  end if;
  return new;
end $$;
create trigger posts_guard before update on posts for each row execute function content_guard();
create trigger comments_guard before update on comments for each row execute function content_guard();

-- ---------- 뷰 ----------
-- 추천수, 감정 건수, 감정가 중앙값(3건 미만이면 null = 감정 대기)
create view post_stats with (security_invoker = true) as
select p.id as post_id,
       (select count(*) from votes v where v.post_id = p.id) as votes,
       s.appraisals,
       case when s.appraisals >= 3 then round(s.median_usd::numeric, 2) end as value_usd
from posts p
left join lateral (
  select count(*) as appraisals,
         percentile_cont(0.5) within group (order by price) as median_usd
  from (
    select c.price_usd as price from comments c
     where c.post_id = p.id and c.status = 'active' and c.price_usd is not null
    union all
    select p.self_price_usd where p.self_price_usd is not null
  ) x
) s on true;

-- 동네 1등: GPS 인증 + active 만 후보, 동률이면 먼저 올린 쪽
create view region_leaders with (security_invoker = true) as
select distinct on (p.region_key) p.region_key, p.id as post_id, st.votes
from posts p
join post_stats st on st.post_id = p.id
where p.status = 'active' and p.loc_source = 'gps'
order by p.region_key, st.votes desc, p.created_at asc;

-- ---------- RLS ----------
create or replace function me_can_write() returns boolean language sql stable as $$
  select coalesce(
    (select banned_until is null or banned_until < now() from profiles where id = auth.uid()),
    false)
$$;

alter table profiles enable row level security;
create policy profiles_read on profiles for select using (true);
create policy profiles_insert_own on profiles for insert with check (id = auth.uid());
create policy profiles_update_own on profiles for update using (id = auth.uid()) with check (id = auth.uid());

alter table posts enable row level security;
create policy posts_read on posts for select using (status = 'active' or user_id = auth.uid());
create policy posts_insert_own on posts for insert with check (user_id = auth.uid() and me_can_write());
create policy posts_update_own on posts for update using (user_id = auth.uid())
  with check (user_id = auth.uid() and status in ('active', 'deleted'));

alter table votes enable row level security;
create policy votes_read on votes for select using (true);
create policy votes_insert_own on votes for insert with check (
  user_id = auth.uid() and me_can_write()
  and not exists (select 1 from posts where id = post_id and user_id = auth.uid())
);
create policy votes_delete_own on votes for delete using (user_id = auth.uid());

alter table comments enable row level security;
create policy comments_read on comments for select using (status = 'active' or user_id = auth.uid());
create policy comments_insert_own on comments for insert with check (user_id = auth.uid() and me_can_write());
create policy comments_update_own on comments for update using (user_id = auth.uid())
  with check (user_id = auth.uid() and status in ('active', 'deleted'));

alter table reports enable row level security;
create policy reports_insert_own on reports for insert with check (reporter_id = auth.uid());

alter table translations enable row level security;
create policy translations_read on translations for select using (true);
-- 쓰기는 서비스 롤(/api/translate)만

alter table payments enable row level security;
create policy payments_read_own on payments for select using (user_id = auth.uid());
-- 쓰기는 서비스 롤(웹훅)만

-- ---------- Storage (Supabase에서만) ----------
do $$ begin
  if to_regclass('storage.buckets') is not null then
    insert into storage.buckets (id, name, public, file_size_limit)
    values ('photos', 'photos', true, 10485760) on conflict (id) do nothing;
  end if;
end $$;
