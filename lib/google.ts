// Google Cloud REST 래퍼 3개. SDK 없음.
const KEY = () => process.env.GOOGLE_CLOUD_API_KEY;

/** Cloud Vision: SafeSearch 위반(adult/racy/violence 또는 null) + 라벨(신뢰도순). 한 번의 호출. 키 없으면 둘 다 빈 값. */
export async function analyzeImage(jpeg: Buffer): Promise<{ violation: string | null; labels: string[] }> {
  const empty = { violation: null, labels: [] };
  if (!KEY()) return empty;
  try {
    const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${KEY()}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        requests: [{
          image: { content: jpeg.toString("base64") },
          features: [{ type: "SAFE_SEARCH_DETECTION" }, { type: "LABEL_DETECTION", maxResults: 10 }],
        }],
      }),
    });
    if (!res.ok) { console.error("vision", res.status, await res.text()); return empty; }
    const json = await res.json();
    const r = json.responses?.[0] ?? {};
    if (r.error) { console.error("vision", r.error); return empty; }
    const s = r.safeSearchAnnotation ?? {};
    const bad = new Set(["LIKELY", "VERY_LIKELY"]);
    let violation: string | null = null;
    for (const k of ["adult", "racy", "violence"]) if (bad.has(s[k])) { violation = k; break; }
    const labels: string[] = (r.labelAnnotations ?? []).map((l: { description: string }) => l.description);
    return { violation, labels };
  } catch (err) {
    console.error("vision", err);
    return empty;
  }
}

export interface Place { country: string | null; countryCode: string | null; city: string | null; neighborhood: string | null }

/** Geocoding API 역지오코딩 → 국가/도시/동네. 키 없거나 실패면 전부 null. */
export async function reverseGeocode(lat: number, lng: number, lang = "en"): Promise<Place> {
  const empty: Place = { country: null, countryCode: null, city: null, neighborhood: null };
  if (!KEY()) return empty;
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=${lang}&key=${KEY()}`,
    );
    if (!res.ok) { console.error("geocode", res.status); return empty; }
    const json = await res.json();
    if (json.status !== "OK") { console.error("geocode", json.status, json.error_message); return empty; }
    type Comp = { long_name: string; short_name: string; types: string[] };
    const comps: Comp[] = json.results?.[0]?.address_components ?? [];
    const find = (...types: string[]) => comps.find((c) => types.some((t) => c.types.includes(t)));
    const country = find("country");
    return {
      country: country?.long_name ?? null,
      countryCode: country?.short_name ?? null,
      city: find("locality", "administrative_area_level_1")?.long_name ?? null,
      neighborhood: find("sublocality_level_1", "sublocality", "neighborhood", "locality")?.long_name ?? null,
    };
  } catch (err) {
    console.error("geocode", err);
    return empty;
  }
}

/** Geocoding API 정방향 검색(장소명 → 좌표). 업로드 핀 검색용. 못 찾으면 null. */
export async function geocodeSearch(query: string, lang = "en"): Promise<{ lat: number; lng: number; label: string } | null> {
  if (!KEY() || !query.trim()) return null;
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&language=${lang}&key=${KEY()}`,
    );
    if (!res.ok) return null;
    const json = await res.json();
    const top = json.results?.[0];
    if (!top) return null;
    return { lat: top.geometry.location.lat, lng: top.geometry.location.lng, label: top.formatted_address };
  } catch (err) {
    console.error("geocode search", err);
    return null;
  }
}

/** Cloud Translation v2. 키 없으면 원문 그대로. */
export async function translateText(q: string[], target: string, source?: string): Promise<string[]> {
  if (!KEY() || q.length === 0) return q;
  const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${KEY()}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ q, target, source, format: "text" }),
  });
  if (!res.ok) return q;
  const json = await res.json();
  return (json.data?.translations ?? []).map((x: { translatedText: string }) => x.translatedText);
}
