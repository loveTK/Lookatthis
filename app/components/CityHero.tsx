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

type Labels = Record<"next" | "posts" | "postsTail" | "topPost" | "value" | "pending", string>;

export function CityHero({ posts, labels }: { posts: FeedRow[]; labels: Labels }) {
  const cities = useMemo(() => topCities(posts), [posts]);
  const [idx, setIdx] = useState(0);

  if (cities.length === 0) return null;

  const city = cities[idx];
  const nextIdx = (idx + 1) % cities.length;
  const next = cities[nextIdx];
  const many = cities.length > 1;

  return (
    <section className="relative h-dvh min-h-[600px] w-full overflow-hidden bg-bg">
      {/* 배경 사진 */}
      <div key={`${city.slug}-bg`} className="absolute inset-0 animate-[hero-bg-in_0.8s_ease-out]">
        <Image src={photoUrl(city.top.photo_path)} alt="" fill priority sizes="100vw" className="scale-[1.02] object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_52%,rgba(0,0,0,.88)_100%)]" />
      </div>

      {/* 도시 목록 (데스크톱) */}
      {many && (
        <aside className="absolute left-5 top-1/2 hidden -translate-y-[43%] flex-col gap-1.5 text-base sm:flex md:left-7">
          {cities.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setIdx(i)}
              className={`flex min-h-5 items-center gap-2 text-left transition ${i === idx ? "text-lg font-bold opacity-100" : "opacity-70 hover:opacity-100"}`}
            >
              {i === idx && <span className="h-4 w-4 shrink-0 rounded-full bg-accent" />}
              {c.city}
            </button>
          ))}
        </aside>
      )}

      {/* 포탈 + 도시 타이틀 */}
      <div className="absolute left-1/2 top-[40%] flex w-[min(130px,33vw)] -translate-x-1/2 -translate-y-1/2 flex-col items-center sm:top-[46%] sm:w-[min(160px,16vw)]">
        {many && (<>
          <div key={`${city.slug}-cap`} className="mb-2 flex w-full animate-[hero-fade_0.6s_ease-out] items-center justify-between text-xs sm:text-sm">
            <span>{labels.next}:</span>
            <span>
              <span className="text-white/70">[{String(nextIdx + 1).padStart(2, "0")}]</span>{" "}
              <strong>{next.city}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIdx(nextIdx)}
            aria-label={`${labels.next}: ${next.city}`}
            className="relative block aspect-[320/350] w-full overflow-hidden rounded-[36px] shadow-2xl transition hover:scale-[1.03] sm:rounded-[45px]"
          >
            <Image src={photoUrl(next.top.photo_path)} alt="" fill sizes="(max-width: 640px) 33vw, 160px" className="object-cover" />
          </button>
        </>)}
        {/* 도시 타이틀: 포탈 바로 아래 */}
        <h1
          key={`${city.slug}-t`}
          className={`${bebas.className} mt-4 animate-[hero-fade_0.9s_ease-out] whitespace-nowrap text-[clamp(64px,18vw,110px)] leading-[0.8] sm:text-[clamp(96px,11vw,180px)]`}
        >
          {city.city.toUpperCase()}
        </h1>
      </div>

      {/* 팩트 */}
      <div className="absolute inset-x-[18px] bottom-[18px] sm:inset-x-10 sm:bottom-8 sm:flex sm:justify-end">
        <dl key={`${city.slug}-f`} className="w-full animate-[hero-fade_0.7s_ease-out_0.2s_both] text-[13px] sm:w-[min(447px,34vw)] sm:text-base">
          <Fact label={labels.posts} value={<><b className="text-accent">{city.count}</b> {labels.postsTail}</>} />
          <Fact
            label={labels.topPost}
            value={<Link href={postPath(city.top.id, city.top.title)} className="hover:underline">{city.top.title} <span className="text-white/60">▲{city.top.votes}</span></Link>}
          />
          <Fact label={labels.value} value={city.top.value_usd != null ? <b className="text-accent">{money(city.top.value_usd)}</b> : <span className="text-white/60">{labels.pending}</span>} />
        </dl>
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[92px_1fr] gap-[18px] border-b border-white/50 py-1.5 last:border-0 sm:grid-cols-[138px_1fr] sm:py-2">
      <dt className="font-bold">{label}:</dt>
      <dd className="m-0">{value}</dd>
    </div>
  );
}
