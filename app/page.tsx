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
        labels={{ pending: tr("post.pending"), leader: tr("post.leader"), locating: tr("home.locating") }}
      />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-4 text-lg font-bold">{tr("home.nearby")}</h2>
        {posts.length === 0 ? (
          <p className="text-dim">{tr("home.empty")}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <PostCard key={p.id} post={p} lang={lang} />)}
          </div>
        )}
      </section>
    </>
  );
}
