#!/usr/bin/env bash
# 로컬 Postgres(PostGIS 포함)에 마이그레이션 적용 후 SQL 테스트 실행.
# 사용: PGURL=postgres://user@host:port scripts/db-test.sh   (기본: 로컬 5432, postgres 유저)
set -euo pipefail
cd "$(dirname "$0")/.."
PGURL="${PGURL:-postgres://postgres@localhost:5432}"
DB=lat_test
psql "$PGURL/postgres" -qc "drop database if exists $DB" -c "create database $DB"
P="psql $PGURL/$DB -q -v ON_ERROR_STOP=1"
$P -f supabase/tests/_auth_stub.sql
for f in supabase/migrations/*.sql; do $P -f "$f"; done
for f in supabase/tests/[0-9]*.sql; do $P -f "$f"; echo "ok  $f"; done
echo "all db tests passed"
