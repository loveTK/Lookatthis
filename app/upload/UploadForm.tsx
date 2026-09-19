"use client";

import { useActionState, useEffect, useState } from "react";
import { createPost, type ActionState } from "@/app/actions";

type Loc = { status: "locating" } | { status: "gps"; lat: number; lng: number; accuracy: number } | { status: "ip" };

export function UploadForm({ labels }: { labels: Record<string, string> }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(createPost, {});
  const [loc, setLoc] = useState<Loc>({ status: "locating" });
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) { setTimeout(() => setLoc({ status: "ip" }), 0); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => setLoc({ status: "gps", lat: p.coords.latitude, lng: p.coords.longitude, accuracy: Math.round(p.coords.accuracy) }),
      () => setLoc({ status: "ip" }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className={`card px-4 py-3 text-sm ${loc.status === "gps" ? "text-accent" : "text-dim"}`}>
        {loc.status === "locating" && labels["upload.locating"]}
        {loc.status === "gps" && `${labels["upload.gps"]} (±${loc.accuracy}m)`}
        {loc.status === "ip" && labels["upload.ip"]}
      </div>
      {loc.status === "gps" && (
        <>
          <input type="hidden" name="source" value="gps" />
          <input type="hidden" name="lat" value={loc.lat} />
          <input type="hidden" name="lng" value={loc.lng} />
          <input type="hidden" name="accuracy" value={loc.accuracy} />
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

      <button className="btn-accent" disabled={pending || loc.status === "locating"}>{labels["upload.submit"]}</button>
      {state.error && <p className="text-sm text-pink">{labels[state.error] ?? labels["err.GENERIC"]}</p>}
    </form>
  );
}
