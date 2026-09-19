import { supabaseAdmin } from "./supabase/admin";
import { translateText } from "./google";

type Kind = "post" | "comment";
interface Item { id: number; lang: string; title?: string | null; body?: string | null }
export type Translated = { title: string | null; body: string | null };

/** 열람 언어로 번역. translations 테이블 캐시 → 없으면 API 1회 호출 후 저장. 원문 언어면 그대로. */
export async function translateMany(kind: Kind, items: Item[], target: string): Promise<Map<number, Translated>> {
  const out = new Map<number, Translated>();
  const todo = items.filter((i) => i.lang !== target);
  for (const i of items) out.set(i.id, { title: i.title ?? null, body: i.body ?? null });
  if (todo.length === 0) return out;

  const admin = supabaseAdmin();
  const { data: cached } = await admin
    .from("translations")
    .select("ref_id, title, body")
    .eq("kind", kind)
    .eq("lang", target)
    .in("ref_id", todo.map((i) => i.id));
  for (const c of cached ?? []) out.set(c.ref_id, { title: c.title, body: c.body });

  const missing = todo.filter((i) => !cached?.some((c) => c.ref_id === i.id));
  if (missing.length === 0) return out;

  // ponytail: 원문 언어가 섞여 있어도 한 번에 보냄 (source 생략 = 자동 감지)
  const q = missing.flatMap((i) => [i.title ?? "", i.body ?? ""]);
  const tr = await translateText(q, target);
  const rows = missing.map((i, k) => ({
    kind, ref_id: i.id, lang: target,
    title: i.title == null ? null : tr[k * 2] ?? i.title,
    body: i.body == null ? null : tr[k * 2 + 1] ?? i.body,
  }));
  for (const r of rows) out.set(r.ref_id, { title: r.title, body: r.body });
  await admin.from("translations").upsert(rows);
  return out;
}
