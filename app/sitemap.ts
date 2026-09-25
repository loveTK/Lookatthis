import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { postPath } from "@/lib/slug";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data } = await supabaseAdmin()
    .from("feed")
    .select("id, title, created_at, city_slug, region_key, neighborhood, votes, appraisals, handle, category")
    .eq("status", "active")
    .or("votes.gt.0,appraisals.gt.0")   // 얇은 페이지 제외
    .order("votes", { ascending: false })
    .limit(5000);
  const rows = data ?? [];
  const cities = new Set(rows.map((r) => r.city_slug).filter(Boolean) as string[]);
  const regions = new Map(rows.filter((r) => r.city_slug && r.neighborhood).map((r) => [r.region_key, r.city_slug as string]));
  const handles = new Set(rows.map((r) => r.handle).filter(Boolean) as string[]);
  const cats = new Set(rows.filter((r) => r.city_slug && r.category && r.category !== "other").map((r) => `${r.city_slug}/c/${r.category}`));
  return [
    { url: site, changeFrequency: "hourly", priority: 1 },
    ...[...cities].map((c) => ({ url: `${site}/city/${c}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...[...regions].map(([r, c]) => ({ url: `${site}/city/${c}/${r}`, changeFrequency: "daily" as const, priority: 0.7 })),
    ...[...cats].map((p) => ({ url: `${site}/city/${p}`, changeFrequency: "daily" as const, priority: 0.7 })),
    ...rows.map((r) => ({ url: `${site}${postPath(r.id, r.title)}`, lastModified: r.created_at, priority: 0.6 })),
    ...[...handles].map((h) => ({ url: `${site}/u/${h}`, changeFrequency: "weekly" as const, priority: 0.4 })),
  ];
}
