-- 테스트 1: 감정가 중앙값 + 감정 대기(3건 미만) 조건
begin;
insert into auth.users values ('00000000-0000-0000-0000-000000000001'), ('00000000-0000-0000-0000-000000000002');
insert into profiles (id, handle, slots) values
  ('00000000-0000-0000-0000-000000000001', 'owner', 5),
  ('00000000-0000-0000-0000-000000000002', 'other', 1);

insert into posts (user_id, title, lang, photo_path, photo_hash, geog, loc_source, self_price_usd)
values ('00000000-0000-0000-0000-000000000001', 'vintage camera', 'en', 'p/1.jpg', 'h1',
        st_setsrid(st_makepoint(126.9780, 37.5665), 4326)::geography, 'gps', 100);

-- 본인 100 + 타인 1건 = 2건 → 감정 대기
insert into comments (post_id, user_id, body, lang, price_usd)
values ((select id from posts where photo_hash = 'h1'), '00000000-0000-0000-0000-000000000002', 'nice', 'en', 300);

do $$
declare s post_stats;
begin
  select * into s from post_stats where post_id = (select id from posts where photo_hash = 'h1');
  assert s.appraisals = 2, 'appraisals expected 2, got ' || s.appraisals;
  assert s.value_usd is null, 'value should be pending with 2 appraisals';
end $$;

-- 3건째 → 중앙값 = 200 (100, 200, 300)
insert into comments (post_id, user_id, body, lang, price_usd)
values ((select id from posts where photo_hash = 'h1'), '00000000-0000-0000-0000-000000000002', 'hmm', 'en', 200);

do $$
declare s post_stats;
begin
  select * into s from post_stats where post_id = (select id from posts where photo_hash = 'h1');
  assert s.appraisals = 3, 'appraisals expected 3';
  assert s.value_usd = 200.00, 'median expected 200, got ' || s.value_usd;
  assert s.votes = 0, 'votes expected 0';
end $$;

-- region_key 자동 채움(geohash5) + 동네 1등 뷰
do $$
declare k text; leader bigint;
begin
  select region_key into k from posts where photo_hash = 'h1';
  assert length(k) = 5, 'region_key should be geohash5, got ' || k;
  select post_id into leader from region_leaders where region_key = k;
  assert leader = (select id from posts where photo_hash = 'h1'), 'post 1 should lead its region';
end $$;
rollback;
