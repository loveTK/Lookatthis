import { headers } from "next/headers";

/** Vercel이 붙여주는 IP 위치 헤더. 로컬 개발에선 없음. */
export async function ipLocation() {
  const h = await headers();
  const lat = Number(h.get("x-vercel-ip-latitude"));
  const lng = Number(h.get("x-vercel-ip-longitude"));
  if (!lat || !lng) return null;
  return { lat, lng, city: h.get("x-vercel-ip-city") ?? null, country: h.get("x-vercel-ip-country") ?? null };
}

export const SEOUL = { lat: 37.5665, lng: 126.978 };
