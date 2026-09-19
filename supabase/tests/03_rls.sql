-- 테스트 3: RLS/가드 — 본인 추천 금지, 남의 글 수정 금지, 숨김 복구 금지, slots 셀프 변경 금지
begin;
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'app_user') then
    create role app_user nologin;
  end if;
end $$;
grant usage on schema public, auth to app_user;
grant execute on function auth.uid() to app_user;
grant select, insert, update, delete on all tables in schema public to app_user;
grant usage, select on all sequences in schema public to app_user;

insert into auth.users values ('00000000-0000-0000-0000-00000000000a'), ('00000000-0000-0000-0000-00000000000b');
insert into profiles (id, handle) values
  ('00000000-0000-0000-0000-00000000000a', 'alice'),
  ('00000000-0000-0000-0000-00000000000b', 'bob');
insert into posts (user_id, title, lang, photo_path, photo_hash, geog, loc_source)
values ('00000000-0000-0000-0000-00000000000a', 'alice post', 'en', 'p/x.jpg', 'hx',
        st_setsrid(st_makepoint(0, 0), 4326)::geography, 'gps');
update posts set status = 'hidden' where photo_hash = 'hx';   -- 운영자가 숨김 처리했다고 가정

set role app_user;
set local app.uid = '00000000-0000-0000-0000-00000000000a';

do $$
declare n int;
begin
  -- 본인 게시물에 본인 추천 → RLS 차단
  begin
    insert into votes (post_id, user_id) values ((select id from posts where photo_hash = 'hx'), '00000000-0000-0000-0000-00000000000a');
    raise exception 'self vote should fail';
  exception when insufficient_privilege then
    assert sqlerrm like '%row-level security%', 'expected RLS denial, got ' || sqlerrm;
  end;

  -- 숨김 상태 복구 시도 → 가드 차단
  begin
    update posts set status = 'active' where photo_hash = 'hx';
    raise exception 'unhide should fail';
  exception when others then
    assert sqlerrm = 'FORBIDDEN_STATUS', 'expected FORBIDDEN_STATUS, got ' || sqlerrm;
  end;

  -- 본인 slots 올리기 → 가드 차단
  begin
    update profiles set slots = 99 where id = '00000000-0000-0000-0000-00000000000a';
    raise exception 'slots bump should fail';
  exception when others then
    assert sqlerrm = 'FORBIDDEN_FIELD', 'expected FORBIDDEN_FIELD, got ' || sqlerrm;
  end;

  -- 숨김 글은 본인에게만 보임
  select count(*) into n from posts where photo_hash = 'hx';
  assert n = 1, 'owner should see own hidden post';
end $$;

set local app.uid = '00000000-0000-0000-0000-00000000000b';
do $$
declare n int;
begin
  select count(*) into n from posts where photo_hash = 'hx';
  assert n = 0, 'others must not see hidden post';

  -- 남의 글 수정 → RLS는 0행 매치 (에러 없이 무시)
  update posts set title = 'hacked' where photo_hash = 'hx';
  get diagnostics n = row_count;
  assert n = 0, 'bob must not update alice post';
end $$;

reset role;
rollback;
