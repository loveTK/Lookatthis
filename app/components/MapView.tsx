"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { APIProvider, AdvancedMarker, Map, useMap } from "@vis.gl/react-google-maps";
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

type Cluster = { lat: number; lng: number; posts: FeedRow[] };

// 줌이 낮을수록(넓게 볼수록) 더 큰 격자로 묶는다. 서울 25개 구처럼 붙어 있는 점들이 겹쳐 보이는 걸 막는다.
function gridSizeDeg(zoom: number) {
  if (zoom <= 3) return 30;
  if (zoom <= 6) return 8;
  if (zoom <= 9) return 1.5;
  if (zoom <= 11) return 0.3;
  return 0.06;
}

function clusterPosts(posts: FeedRow[], zoom: number): Cluster[] {
  const cell = gridSizeDeg(zoom);
  const groups: Record<string, FeedRow[]> = {};
  for (const p of posts) {
    const key = `${Math.round(p.lat / cell)}:${Math.round(p.lng / cell)}`;
    (groups[key] ??= []).push(p);
  }
  return Object.values(groups).map((g) => ({
    lat: g.reduce((s, p) => s + p.lat, 0) / g.length,
    lng: g.reduce((s, p) => s + p.lng, 0) / g.length,
    posts: g,
  }));
}

// agora(myagora.xyz) 클러스터 버블 크기 공식(로그 스케일 + 상하한)을 이 프로젝트 마커 스케일에 맞춰 조정.
const bubbleSize = (n: number) => Math.round(Math.max(24, Math.min(48, 18 + 10 * Math.log10(n))));

function ClusterMarkers({ posts, onSelect }: { posts: FeedRow[]; onSelect: (p: FeedRow) => void }) {
  const map = useMap();
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    if (!map) return;
    const listener = map.addListener("zoom_changed", () => setZoom(map.getZoom() ?? 13));
    return () => listener.remove();
  }, [map]);

  const clusters = useMemo(() => clusterPosts(posts, zoom), [posts, zoom]);

  return (
    <>
      {clusters.map((c, i) => {
        if (c.posts.length === 1) {
          const p = c.posts[0];
          return (
            <AdvancedMarker key={p.id} position={{ lat: p.lat, lng: p.lng }} onClick={() => onSelect(p)} zIndex={p.is_leader ? 2 : 1}>
              <div
                className={`h-4 w-4 rounded-full border-2 border-bg ${p.is_leader ? "bg-accent shadow-[0_0_0_6px_rgba(67,255,161,0.25)]" : p.loc_source === "ip" ? "bg-dim" : "bg-violet"}`}
                title={p.title}
              />
            </AdvancedMarker>
          );
        }
        const size = bubbleSize(c.posts.length);
        const hasLeader = c.posts.some((p) => p.is_leader);
        return (
          <AdvancedMarker
            key={`c-${i}`}
            position={{ lat: c.lat, lng: c.lng }}
            zIndex={3}
            onClick={() => { map?.panTo({ lat: c.lat, lng: c.lng }); map?.setZoom(Math.min(20, zoom + 2.5)); }}
          >
            <div
              style={{ width: size, height: size }}
              className={`flex items-center justify-center rounded-full border-2 text-xs font-bold shadow-lg ${hasLeader ? "border-accent bg-accent/90 text-accent-ink" : "border-bg bg-violet text-white"}`}
            >
              {c.posts.length}
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
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
          minZoom={2}
          mapId={mapId}
          colorScheme="DARK"
          gestureHandling="greedy"
          disableDefaultUI
          restriction={{ latLngBounds: { north: 85, south: -85, west: -180, east: 180 }, strictBounds: true }}
          onClick={() => setSelected(null)}
          className="h-full w-full"
        >
          <ClusterMarkers posts={posts} onSelect={setSelected} />
        </Map>
      </APIProvider>

      {locating && <div className="absolute left-3 top-3 chip bg-bg/80 text-dim">{labels.locating}</div>}

      {selected && (
        <Link href={postPath(selected.id, selected.title)} className="card absolute inset-x-3 bottom-3 flex items-center gap-3 p-3 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected.photo_path.startsWith("http") ? selected.photo_path : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${selected.photo_path}`}
            alt=""
            className="h-16 w-16 rounded-lg object-cover"
          />
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
