"use server";

import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { reverseGeocode, safeSearch } from "@/lib/google";
import { ipLocation } from "@/lib/geo";
import { getLang } from "@/lib/i18n";
import { postPath, slugify } from "@/lib/slug";

export type ActionState = { error?: string; ok?: boolean };

export async function setLang(formData: FormData) {
  const lang = formData.get("lang") === "ko" ? "ko" : "en";
  (await cookies()).set("lang", lang, { maxAge: 60 * 60 * 24 * 365, path: "/" });
  redirect((formData.get("next") as string) || "/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function createProfile(_: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const handle = String(formData.get("handle") ?? "").trim().toLowerCase();
  const { error } = await supabase
    .from("profiles")
    .insert({ id: user.id, handle, lang: await getLang() });
  if (error) return { error: error.code === "23505" ? "onboarding.taken" : "err.GENERIC" };
  redirect("/upload");
}

export async function createPost(_: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/upload");

  // 1) 위치: GPS(폼) 우선, 아니면 IP 헤더
  let lat = Number(formData.get("lat")), lng = Number(formData.get("lng"));
  let loc_source: "gps" | "ip" = "gps";
  const accuracy_m = Number(formData.get("accuracy")) || null;
  if (formData.get("source") !== "gps" || !lat || !lng) {
    const ip = await ipLocation();
    if (!ip) return { error: "err.NO_LOCATION" };
    ({ lat, lng } = ip);
    loc_source = "ip";
  }

  // 2) 사진: 10MB 제한 → 2000px 리사이즈 + EXIF 제거(sharp 기본) → 해시
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) return { error: "err.GENERIC" };
  if (file.size > 10 * 1024 * 1024) return { error: "err.TOO_LARGE" };
  const jpeg = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  const photo_hash = createHash("sha256").update(jpeg).digest("hex");

  // 3) 검열
  if (await safeSearch(jpeg)) return { error: "err.REJECTED" };

  // 4) 역지오코딩 → region_key / city_slug
  const place = await reverseGeocode(lat, lng);
  const city_slug = place.city ? slugify(`${place.city}-${place.countryCode ?? ""}`) : null;
  const region_key = place.city && place.neighborhood ? slugify(`${place.city}-${place.neighborhood}`) : ""; // '' → DB가 geohash5

  // 5) 업로드(서비스 롤) → insert(사용자 권한: RLS + 인벤토리 트리거)
  const photo_path = `${user.id}/${photo_hash}.jpg`;
  const { error: upErr } = await supabaseAdmin().storage
    .from("photos")
    .upload(photo_path, jpeg, { contentType: "image/jpeg", upsert: true });
  if (upErr) return { error: "err.GENERIC" };

  const title = String(formData.get("title") ?? "").trim().slice(0, 80);
  const body = String(formData.get("body") ?? "").trim().slice(0, 1000) || null;
  const priceRaw = String(formData.get("self_price") ?? "").replace(/[^0-9.]/g, "");
  const self_price_usd = priceRaw ? Number(priceRaw) : null;

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id, title, body, lang: await getLang(), photo_path, photo_hash,
      geog: `SRID=4326;POINT(${lng} ${lat})`, accuracy_m, loc_source,
      country: place.country, city: place.city, city_slug, neighborhood: place.neighborhood,
      region_key, self_price_usd,
    })
    .select("id")
    .single();
  if (error) {
    if (error.message.includes("INVENTORY_FULL")) return { error: "err.INVENTORY_FULL" };
    if (error.code === "23505") return { error: "err.DUPLICATE" };
    if (error.code === "42501") return { error: "err.BANNED" };
    return { error: "err.GENERIC" };
  }
  redirect(postPath(data.id, title));
}

export async function toggleVote(formData: FormData) {
  const post_id = Number(formData.get("post_id"));
  const path = String(formData.get("path") ?? "/");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(path)}`);
  const { data: existing } = await supabase.from("votes").select("post_id").eq("post_id", post_id).eq("user_id", user.id).maybeSingle();
  const { error } = existing
    ? await supabase.from("votes").delete().eq("post_id", post_id).eq("user_id", user.id)
    : await supabase.from("votes").insert({ post_id, user_id: user.id });
  revalidatePath(path);
  if (error) redirect(`${path}?voteError=1`);
}

export async function addComment(formData: FormData) {
  const post_id = Number(formData.get("post_id"));
  const path = String(formData.get("path") ?? "/");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(path)}`);
  const body = String(formData.get("body") ?? "").trim().slice(0, 500);
  const priceRaw = String(formData.get("price") ?? "").replace(/[^0-9.]/g, "");
  if (!body) return;
  await supabase.from("comments").insert({
    post_id, user_id: user.id, body, lang: await getLang(),
    price_usd: priceRaw ? Number(priceRaw) : null,
  });
  revalidatePath(path);
}

export async function report(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const path = String(formData.get("path") ?? "/");
  if (!user) redirect(`/login?next=${encodeURIComponent(path)}`);
  const post_id = formData.get("post_id") ? Number(formData.get("post_id")) : null;
  const comment_id = formData.get("comment_id") ? Number(formData.get("comment_id")) : null;
  await supabase.from("reports").insert({ reporter_id: user.id, post_id, comment_id, reason: String(formData.get("reason")) });
  revalidatePath(path);
}
