"use client";

import { useActionState, useEffect, useState } from "react";
import { APIProvider, AdvancedMarker, Map, type MapMouseEvent } from "@vis.gl/react-google-maps";
import { createPost, type ActionState } from "@/app/actions";

type Gps = { lat: number; lng: number; accuracy: number };
type Pin = { lat: number; lng: number };

export function UploadForm({ labels }: { labels: Record<string, string> }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(createPost, {});
  const [gps, setGps] = useState<Gps | null | undefined>(undefined); // undefined = 찾는 중
  const [mode, setMode] = useState<"gps" | "pin">("gps");
  const [pin, setPin] = useState<Pin | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

  useEffect(() => {
    if (!navigator.geolocation) { setTimeout(() => setGps(null), 0); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => setGps({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: Math.round(p.coords.accuracy) }),
      () => setGps(null),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

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
          onChange={(e) => { const f = e.target.files?.[0]; setPreview(f ? URL.createObjectURL(f) : null); }}
        />
      </label>

      <input className="input" name="title" required maxLength={80} placeholder={labels["upload.name"]} />
      <textarea className="input" name="body" rows={3} maxLength={1000} placeholder={labels["upload.body"]} />
      <input className="input" name="self_price" inputMode="decimal" placeholder={labels["upload.price"]} />

      <button className="btn-accent" disabled={pending || locating || (mode === "pin" && !pin)}>{labels["upload.submit"]}</button>
      {state.error && <p className="text-sm text-pink">{labels[state.error] ?? labels["err.GENERIC"]}</p>}
    </form>
  );
}
