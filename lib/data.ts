import { cache } from "react";
import { createClient } from "./supabase/server";
import type { CommentRow, FeedRow } from "./types";

export const getPost = cache(async (id: number): Promise<FeedRow | null> => {
  const supabase = await createClient();
  const { data } = await supabase.from("feed").select("*").eq("id", id).maybeSingle();
  return data;
});

export async function getComments(postId: number): Promise<CommentRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("comments")
    .select("id, post_id, user_id, body, lang, price_usd, created_at, profiles(handle)")
    .eq("post_id", postId)
    .eq("status", "active")
    .order("created_at");
  return (data ?? []) as unknown as CommentRow[];
}

export async function feedAll(limit = 3000): Promise<FeedRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("feed")
    .select("*")
    .eq("status", "active")
    .order("votes", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function feedInBox(lat: number, lng: number, dLat = 0.15, dLng = 0.2, limit = 200): Promise<FeedRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("feed")
    .select("*")
    .eq("status", "active")
    .gte("lat", lat - dLat).lte("lat", lat + dLat)
    .gte("lng", lng - dLng).lte("lng", lng + dLng)
    .order("votes", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function feedWhere(col: "city_slug" | "region_key" | "handle", value: string, limit = 100): Promise<FeedRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("feed")
    .select("*")
    .eq("status", "active")
    .eq(col, value)
    .order("votes", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(limit);
  return data ?? [];
}

export async function feedCityCategory(city_slug: string, category: string, limit = 100): Promise<FeedRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("feed")
    .select("*")
    .eq("status", "active")
    .eq("city_slug", city_slug)
    .eq("category", category)
    .order("votes", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(limit);
  return data ?? [];
}

/** 커뮤니티 감정가 분포 (본인 값 포함) */
export function appraisalRange(post: FeedRow, comments: CommentRow[]) {
  const prices = comments.map((c) => c.price_usd).filter((p): p is number => p != null).map(Number);
  if (post.self_price_usd != null) prices.push(Number(post.self_price_usd));
  if (prices.length === 0) return null;
  return { low: Math.min(...prices), high: Math.max(...prices), n: prices.length };
}
