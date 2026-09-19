-- 2단계: 앱이 읽는 뷰 + 좌표/도시 슬러그 컬럼
alter table posts
  add column lat double precision generated always as (st_y(geog::geometry)) stored,
  add column lng double precision generated always as (st_x(geog::geometry)) stored,
  add column city_slug text;
create index posts_city_idx on posts (city_slug, status);
create index posts_latlng_idx on posts (lat, lng) where status = 'active';

-- 지도/피드/상세/허브가 전부 이 뷰 하나만 읽는다
create view feed with (security_invoker = true) as
select p.id, p.user_id, pr.handle, p.title, p.body, p.lang, p.photo_path,
       p.lat, p.lng, p.loc_source, p.accuracy_m,
       p.country, p.city, p.city_slug, p.neighborhood, p.region_key,
       p.self_price_usd, p.status, p.created_at,
       st.votes, st.appraisals, st.value_usd,
       (rl.post_id is not null) as is_leader
from posts p
join profiles pr on pr.id = p.user_id
join post_stats st on st.post_id = p.id
left join region_leaders rl on rl.post_id = p.id;
