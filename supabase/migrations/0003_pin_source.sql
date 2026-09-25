-- 3단계: 아무 곳에나 핀 꽂아 올리기. 'pin'은 GPS 인증이 아니므로 region_leaders(동네 1등) 후보에서 자동 제외됨(뷰가 loc_source='gps'만 봄).
alter table posts drop constraint posts_loc_source_check;
alter table posts add constraint posts_loc_source_check check (loc_source in ('gps', 'ip', 'pin'));
