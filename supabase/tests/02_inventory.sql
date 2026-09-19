-- 테스트 2: 인벤토리 1칸 초과 insert → INVENTORY_FULL, 결제 후엔 통과
begin;
insert into auth.users values ('00000000-0000-0000-0000-000000000003');
insert into profiles (id, handle) values ('00000000-0000-0000-0000-000000000003', 'one_slot');

insert into posts (user_id, title, lang, photo_path, photo_hash, geog, loc_source)
values ('00000000-0000-0000-0000-000000000003', 'first', 'en', 'p/a.jpg', 'ha',
        st_setsrid(st_makepoint(129.0756, 35.1796), 4326)::geography, 'gps');

do $$
begin
  begin
    insert into posts (user_id, title, lang, photo_path, photo_hash, geog, loc_source)
    values ('00000000-0000-0000-0000-000000000003', 'second', 'en', 'p/b.jpg', 'hb',
            st_setsrid(st_makepoint(129.0756, 35.1796), 4326)::geography, 'gps');
    raise exception 'second insert should have failed';
  exception when others then
    assert sqlerrm = 'INVENTORY_FULL', 'expected INVENTORY_FULL, got ' || sqlerrm;
  end;
end $$;

-- 결제 1건(슬롯 +5) → slots 6 → 두 번째 게시물 통과
insert into payments (id, user_id, slots_added, amount_usd)
values ('order_test_1', '00000000-0000-0000-0000-000000000003', 5, 6.99);

do $$
declare n int;
begin
  select slots into n from profiles where id = '00000000-0000-0000-0000-000000000003';
  assert n = 6, 'slots expected 6, got ' || n;
end $$;

insert into posts (user_id, title, lang, photo_path, photo_hash, geog, loc_source)
values ('00000000-0000-0000-0000-000000000003', 'second', 'en', 'p/b.jpg', 'hb',
        st_setsrid(st_makepoint(129.0756, 35.1796), 4326)::geography, 'gps');

-- 같은 주문 id 재수신(웹훅 중복) → PK 충돌, slots 그대로
do $$
begin
  begin
    insert into payments (id, user_id, slots_added, amount_usd)
    values ('order_test_1', '00000000-0000-0000-0000-000000000003', 5, 6.99);
    raise exception 'duplicate payment should have failed';
  exception when unique_violation then null;
  end;
end $$;
rollback;
