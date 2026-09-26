"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bebas_Neue } from "next/font/google";
import type { FeedRow } from "@/lib/types";
import { money, postPath } from "@/lib/slug";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

// admin.ts는 서비스 롤을 다루니 클라이언트 컴포넌트에 안 끌어옴 — MapView.tsx와 같은 방식으로 인라인.
const photoUrl = (path: string) =>
  path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${path}`;

type CityStat = { slug: string; city: string; count: number; top: FeedRow };

function topCities(posts: FeedRow[], take = 6): CityStat[] {
  const groups = new Map<string, FeedRow[]>();
  for (const p of posts) {
    if (!p.city_slug || !p.city) continue;
    (groups.get(p.city_slug) ?? groups.set(p.city_slug, []).get(p.city_slug)!).push(p);
  }
  return [...groups.entries()]
    .map(([slug, ps]) => ({ slug, city: ps[0].city!, count: ps.length, top: ps.reduce((a, b) => (b.votes > a.votes ? b : a)) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, take);
}

type Labels = Record<"next" | "posts" | "topPost" | "value" | "pending", string>;

export function CityHero({ posts, labels }: { posts: FeedRow[]; labels: Labels }) {
  const cities = useMemo(() => topCities(posts), [posts]);
  const [idx, setIdx] = useState(0);

  if (cities.length === 0) return null;

  const city = cities[idx];
  const next = cities[(idx + 1) % cities.length];

  return (
    <section className="relative h-[74vh] min-h-[520px] w-full overflow-hidden bg-bg">
      <div key={`${city.slug}-bg`} className="absolute inset-0 animate-[hero-bg-in_0.7s_ease-out]">
        <Image src={photoUrl(city.top.photo_path)} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/90" />
      </div>

      {cities.length > 1 && (
        <div className="absolute left-4 top-1/2 hidden -translate-y-1/2 flex-col gap-2 md:left-8 sm:flex">
          {cities.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setIdx(i)}
              className={`flex items-center gap-2 text-left transition ${i === idx ? "text-lg font-bold text-ink" : "text-sm text-white/60 hover:text-white"}`}
            >
              {i === idx && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />}
              {c.city}
            </button>
          ))}
        </div>
      )}

      {cities.length > 1 && (
        <div className="absolute left-1/2 top-[40%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
          <p className="text-xs text-white/70">{labels.next} · <strong className="text-ink">{next.city}</strong></p>
          <button
            type="button"
            onClick={() => setIdx((i) => (i + 1) % cities.length)}
            aria-label={`${labels.next}: ${next.city}`}
            className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-white/40 shadow-2xl transition hover:scale-105 sm:h-44 sm:w-44"
          >
            <Image src={photoUrl(next.top.photo_path)} alt="" fill sizes="176px" className="object-cover" />
          </button>
        </div>
      )}

      <div className="absolute inset-x-4 bottom-6 flex flex-col gap-5 sm:inset-x-10 sm:bottom-10 sm:flex-row sm:items-end sm:justify-between">
        <h1 key={`${city.slug}-t`} className={`${bebas.className} animate-[hero-fade_0.6s_ease-out] text-[19vw] leading-[0.8] tracking-tight text-ink sm:text-[8vw] lg:text-[6.5rem]`}>
          {city.city.toUpperCase()}
        </h1>
        <dl key={`${city.slug}-f`} className="grid animate-[hero-fade_0.6s_ease-out] gap-2 text-sm sm:w-[340px]">
          <Fact label={labels.posts} value={String(city.count)} />
          <Fact
            label={labels.topPost}
            value={<Link href={postPath(city.top.id, city.top.title)} className="hover:underline">{city.top.title} <span className="text-dim">▲{city.top.votes}</span></Link>}
          />
          <Fact label={labels.value} value={city.top.value_usd != null ? <span className="font-bold text-accent">{money(city.top.value_usd)}</span> : <span className="text-dim">{labels.pending}</span>} />
        </dl>
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 border-b border-white/15 py-1.5 text-white/90 last:border-0">
      <dt className="font-bold text-white">{label}</dt>
      <dd className="truncate">{value}</dd>
    </div>
  );
}
