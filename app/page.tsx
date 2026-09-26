import Link from "next/link";
import { feedAll, feedInBox } from "@/lib/data";
import { ipLocation, SEOUL } from "@/lib/geo";
import { getLang, t } from "@/lib/i18n";
import { CityHero } from "./components/CityHero";
import { MapView } from "./components/MapView";
import { PostCard } from "./components/PostCard";

export default async function Home({ searchParams }: { searchParams: Promise<{ lat?: string; lng?: string }> }) {
  const sp = await searchParams;
  const fromUrl = !!(Number(sp.lat) && Number(sp.lng));
  const center = fromUrl ? { lat: Number(sp.lat), lng: Number(sp.lng) } : (await ipLocation()) ?? SEOUL;
  const [allPosts, posts] = await Promise.all([feedAll(), feedInBox(center.lat, center.lng)]);
  const lang = await getLang();
  const tr = t(lang);

  return (
    <>
      <CityHero posts={allPosts} labels={{ next: tr("home.hero.next"), posts: tr("home.hero.posts"), topPost: tr("home.hero.topPost"), value: tr("post.value"), pending: tr("post.pending") }} />

      <section className="mx-auto max-w-6xl px-4 pt-10">
        <h2 className="text-2xl font-bold tracking-tight text-balance">{tr("home.map.title")}</h2>
        <p className="mt-2 max-w-2xl text-sm text-dim">{tr("home.map.body")}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-dim">
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-accent" />{tr("home.map.legend.leader")}</span>
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-violet" />{tr("home.map.legend.gps")}</span>
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-dim" />{tr("home.map.legend.pin")}</span>
        </div>
      </section>

      <MapView
        posts={allPosts}
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? ""}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID ?? "DEMO_MAP_ID"}
        labels={{ pending: tr("post.pending"), leader: tr("post.leader"), noMap: tr("home.noMap"), showOffHere: tr("home.showOffHere") }}
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
