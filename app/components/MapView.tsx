"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { APIProvider, AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import type { FeedRow } from "@/lib/types";
import { money, postPath } from "@/lib/slug";

interface Props {
  posts: FeedRow[];
  center: { lat: number; lng: number };
  fromUrl: boolean;
  apiKey: string;
  mapId: string;
  labels: Record<"pending" | "leader" | "locating" | "noMap", string>;
}

export function MapView({ posts, center, fromUrl, apiKey, mapId, labels }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<FeedRow | null>(null);
  const [locating, setLocating] = useState(!fromUrl && !!apiKey);

  // URL에 좌표 없으면 브라우저 위치로 한 번 이동 (사용자 위치는 저장 안 함, URL에만)
  useEffect(() => {
    if (!apiKey || fromUrl || !navigator.geolocation) { setTimeout(() => setLocating(false), 0); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => router.replace(`/?lat=${p.coords.latitude.toFixed(4)}&lng=${p.coords.longitude.toFixed(4)}`),
      () => setLocating(false),
      { timeout: 8000, maximumAge: 300000 },
    );
  }, [apiKey, fromUrl, router]);

  if (!apiKey) {
    return (
      <div className="flex h-[40vh] min-h-[260px] w-full items-center justify-center border-b border-line bg-panel px-4 text-center text-sm text-dim">
        {labels.noMap}
      </div>
    );
  }

  return (
    <div className="relative h-[60vh] min-h-[380px] w-full">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={13}
          mapId={mapId}
          colorScheme="DARK"
          gestureHandling="greedy"
          disableDefaultUI
          onClick={() => setSelected(null)}
          className="h-full w-full"
        >
          {posts.map((p) => (
            <AdvancedMarker key={p.id} position={{ lat: p.lat, lng: p.lng }} onClick={() => setSelected(p)} zIndex={p.is_leader ? 2 : 1}>
              <div
                className={`h-4 w-4 rounded-full border-2 border-bg ${p.is_leader ? "bg-accent shadow-[0_0_0_6px_rgba(67,255,161,0.25)]" : p.loc_source === "ip" ? "bg-dim" : "bg-violet"}`}
                title={p.title}
              />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>

      {locating && <div className="absolute left-3 top-3 chip bg-bg/80 text-dim">{labels.locating}</div>}

      {selected && (
        <Link href={postPath(selected.id, selected.title)} className="card absolute inset-x-3 bottom-3 flex items-center gap-3 p-3 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${selected.photo_path}`} alt="" className="h-16 w-16 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {selected.is_leader && <span className="chip bg-accent text-accent-ink">{labels.leader}</span>}
              <h3 className="truncate font-bold">{selected.title}</h3>
            </div>
            <p className="truncate text-xs text-dim">{[selected.neighborhood, selected.city].filter(Boolean).join(" · ")}</p>
            <p className="mt-1 text-sm">▲ {selected.votes} · {selected.value_usd != null ? <span className="font-bold text-accent">{money(selected.value_usd)}</span> : <span className="text-dim">{labels.pending}</span>}</p>
          </div>
        </Link>
      )}
    </div>
  );
}
