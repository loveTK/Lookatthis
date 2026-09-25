-- 4단계: 사진 라벨(Vision)로 자동 분류한 카테고리. 사용자 입력 없음. 'other'는 허브 페이지 없음.
alter table posts add column category text not null default 'other'
  check (category in ('park', 'food', 'beach', 'art', 'landmark', 'other'));
create index posts_city_category_idx on posts (city_slug, category, status);

-- feed 뷰에 category 추가 (컬럼은 끝에만 덧붙일 수 있어 전체를 다시 정의)
create or replace view feed with (security_invoker = true) as
select p.id, p.user_id, pr.handle, p.title, p.body, p.lang, p.photo_path,
       p.lat, p.lng, p.loc_source, p.accuracy_m,
       p.country, p.city, p.city_slug, p.neighborhood, p.region_key,
       p.self_price_usd, p.status, p.created_at,
       st.votes, st.appraisals, st.value_usd,
       (rl.post_id is not null) as is_leader,
       p.category
from posts p
join profiles pr on pr.id = p.user_id
join post_stats st on st.post_id = p.id
left join region_leaders rl on rl.post_id = p.id;
