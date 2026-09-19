import Link from "next/link";
import { feedInBox } from "@/lib/data";
import { ipLocation, SEOUL } from "@/lib/geo";
import { getLang, t } from "@/lib/i18n";
import { MapView } from "./components/MapView";
import { PostCard } from "./components/PostCard";

export default async function Home({ searchParams }: { searchParams: Promise<{ lat?: string; lng?: string }> }) {
  const sp = await searchParams;
  const fromUrl = !!(Number(sp.lat) && Number(sp.lng));
  const center = fromUrl ? { lat: Number(sp.lat), lng: Number(sp.lng) } : (await ipLocation()) ?? SEOUL;
  const posts = await feedInBox(center.lat, center.lng);
  const lang = await getLang();
  const tr = t(lang);

  return (
    <>
      <MapView
        posts={posts}
        center={center}
        fromUrl={fromUrl}
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? ""}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID ?? "DEMO_MAP_ID"}
        labels={{ pending: tr("post.pending"), leader: tr("post.leader"), locating: tr("home.locating"), noMap: tr("home.noMap") }}
      />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{tr("home.nearby")}</h1>
            <p className="mt-1 text-sm text-dim">{tr("tagline")}</p>
          </div>
          <span className="hidden text-sm text-dim sm:inline">{posts.length} {tr("home.count")}</span>
        </div>
        {posts.length === 0 ? (
          <div className="card flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-bold">{tr("home.empty")}</p>
              <p className="mt-1 text-sm text-dim">{tr("home.emptyHint")}</p>
            </div>
            <Link href="/upload" className="btn-accent">{tr("nav.upload")}</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <PostCard key={p.id} post={p} lang={lang} />)}
          </div>
        )}
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1fr_2fr]">
          <h2 className="text-2xl font-bold tracking-tight">{tr("how.title")}</h2>
          <ol className="grid gap-6 sm:grid-cols-3">
            {(["post", "vote", "win"] as const).map((k, i) => (
              <li key={k}>
                <div className="text-3xl font-extrabold text-accent">{i + 1}</div>
                <h3 className="mt-2 font-bold">{tr(`how.${k}`)}</h3>
                <p className="mt-1 text-sm text-dim">{tr(`how.${k}.body`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
