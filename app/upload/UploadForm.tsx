"use client";

import { useActionState, useEffect, useState } from "react";
import { APIProvider, AdvancedMarker, Map, useMap, type MapMouseEvent } from "@vis.gl/react-google-maps";
import { createPost, searchLocation, type ActionState } from "@/app/actions";

type Gps = { lat: number; lng: number; accuracy: number };
type Pin = { lat: number; lng: number };

function FlyTo({ target }: { target: Pin | null }) {
  const map = useMap();
  useEffect(() => { if (map && target) { map.panTo(target); map.setZoom(14); } }, [map, target]);
  return null;
}

// Vercel 서버 함수는 요청 본문이 4.5MB 넘으면 서버 코드가 실행되기도 전에 413으로 거부한다.
// 폰 카메라 원본은 보통 그보다 크므로, 서버가 리사이즈하기 전에 브라우저에서 먼저 줄여 보낸다.
// EXIF 방향은 여기서 굽고(canvas는 픽셀만 남기고 EXIF를 버림), 서버의 sharp().rotate()는 안전망으로 남긴다.
async function shrinkForUpload(file: File, maxDim = 1600, quality = 0.85): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale), h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file; // 못 줄이면 원본 그대로 (서버 쪽 10MB/413 처리에 맡김)
  }
}

export function UploadForm({ labels, initialPin = null }: { labels: Record<string, string>; initialPin?: Pin | null }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(createPost, {});
  const [gps, setGps] = useState<Gps | null | undefined>(undefined); // undefined = 찾는 중
  const [mode, setMode] = useState<"gps" | "pin">(initialPin ? "pin" : "gps");
  const [pin, setPin] = useState<Pin | null>(initialPin);
  const [flyTarget, setFlyTarget] = useState<Pin | null>(initialPin);
  const [preview, setPreview] = useState<string | null>(null);
  const [shrinking, setShrinking] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

  useEffect(() => {
    if (!navigator.geolocation) { setTimeout(() => setGps(null), 0); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => setGps({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: Math.round(p.coords.accuracy) }),
      () => setGps(null),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  async function runSearch() {
    if (!query.trim() || searching) return;
    setSearching(true);
    setSearchError(false);
    const found = await searchLocation(query);
    setSearching(false);
    if (!found) { setSearchError(true); return; }
    setPin({ lat: found.lat, lng: found.lng });
    setFlyTarget({ lat: found.lat, lng: found.lng });
  }

  const usingGps = mode === "gps" && !!gps;
  const usingPin = mode === "pin" && !!pin;
  const locating = mode === "gps" && gps === undefined;

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="card p-3 text-sm">
        <div className="mb-2 flex gap-2">
          <button type="button" onClick={() => setMode("gps")} className={mode === "gps" ? "btn-accent py-1.5!" : "btn-ghost py-1.5!"}>{labels["upload.useGps"]}</button>
          <button type="button" onClick={() => setMode("pin")} className={mode === "pin" ? "btn-accent py-1.5!" : "btn-ghost py-1.5!"}>{labels["upload.pickOnMap"]}</button>
        </div>
        {mode === "gps" && (
          <p className={gps ? "text-accent" : "text-dim"}>
            {gps === undefined && labels["upload.locating"]}
            {gps && `${labels["upload.gps"]} (±${gps.accuracy}m)`}
            {gps === null && labels["upload.ip"]}
          </p>
        )}
        {mode === "pin" && (
          <>
            {apiKey && (
              <div className="mb-2 flex gap-2">
                <input
                  className="input" value={query} placeholder={labels["upload.searchPlaceholder"]}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); runSearch(); } }}
                />
                <button type="button" onClick={runSearch} disabled={searching} className="btn-ghost shrink-0">{labels["upload.searchButton"]}</button>
              </div>
            )}
            {searchError && <p className="mb-2 text-pink">{labels["upload.searchNotFound"]}</p>}
            <p className="mb-2 text-dim">{pin ? `${labels["upload.pinned"]} ${pin.lat.toFixed(4)}, ${pin.lng.toFixed(4)}` : labels["upload.pin"]}</p>
            {apiKey ? (
              <div className="h-56 overflow-hidden rounded-xl">
                <APIProvider apiKey={apiKey}>
                  <Map
                    defaultCenter={gps ? { lat: gps.lat, lng: gps.lng } : { lat: 20, lng: 0 }}
                    defaultZoom={gps ? 12 : 2}
                    minZoom={2}
                    mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID ?? "DEMO_MAP_ID"}
                    colorScheme="DARK"
                    gestureHandling="greedy"
                    disableDefaultUI
                    restriction={{ latLngBounds: { north: 85, south: -85, west: -180, east: 180 }, strictBounds: true }}
                    onClick={(e: MapMouseEvent) => e.detail.latLng && setPin({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng })}
                    className="h-full w-full"
                  >
                    <FlyTo target={flyTarget} />
                    {pin && (
                      <AdvancedMarker position={pin}>
                        <div className="h-4 w-4 rounded-full border-2 border-bg bg-accent shadow-[0_0_0_6px_rgba(67,255,161,0.25)]" />
                      </AdvancedMarker>
                    )}
                  </Map>
                </APIProvider>
              </div>
            ) : (
              <p className="text-dim">{labels["home.noMap"]}</p>
            )}
          </>
        )}
      </div>
      {usingGps && (
        <>
          <input type="hidden" name="source" value="gps" />
          <input type="hidden" name="lat" value={gps.lat} />
          <input type="hidden" name="lng" value={gps.lng} />
          <input type="hidden" name="accuracy" value={gps.accuracy} />
        </>
      )}
      {usingPin && (
        <>
          <input type="hidden" name="source" value="pin" />
          <input type="hidden" name="lat" value={pin.lat} />
          <input type="hidden" name="lng" value={pin.lng} />
        </>
      )}

      <label className="card flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-dim">{labels["upload.photo"]}</span>
        )}
        <input
          type="file" name="photo" accept="image/*" capture="environment" required className="hidden"
          onChange={async (e) => {
            const input = e.target;
            const f = input.files?.[0];
            if (!f) { setPreview(null); return; }
            setShrinking(true);
            const small = await shrinkForUpload(f);
            setShrinking(false);
            const dt = new DataTransfer();
            dt.items.add(small);
            input.files = dt.files;
            setPreview(URL.createObjectURL(small));
          }}
        />
      </label>

      <input className="input" name="title" required maxLength={80} placeholder={labels["upload.name"]} />
      <textarea className="input" name="body" rows={3} maxLength={1000} placeholder={labels["upload.body"]} />
      <input className="input" name="self_price" inputMode="decimal" placeholder={labels["upload.price"]} />

      <button className="btn-accent" disabled={pending || shrinking || locating || (mode === "pin" && !pin)}>{labels["upload.submit"]}</button>
      {state.error && <p className="text-sm text-pink">{labels[state.error] ?? labels["err.GENERIC"]}</p>}
    </form>
  );
}
