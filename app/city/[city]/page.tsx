import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { feedWhere } from "@/lib/data";
import { getLang, t } from "@/lib/i18n";
import { PostCard } from "@/app/components/PostCard";
import { HubJsonLd } from "../HubJsonLd";

type Props = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const posts = await feedWhere("city_slug", (await params).city, 1);
  const city = posts[0]?.city;
  if (!city) return {};
  return {
    title: `Best of ${city} — hidden gems ranked by locals`,
    description: `Local favorites in ${city}, ${posts[0].country ?? ""}: things to see that locals show off, ranked by upvotes and community appraisals.`,
    alternates: { canonical: `/city/${posts[0].city_slug}` },
  };
}

export default async function CityPage({ params }: Props) {
  const { city: slug } = await params;
  const posts = await feedWhere("city_slug", slug);
  if (posts.length === 0) notFound();
  const lang = await getLang();
  const tr = t(lang);
  const city = posts[0].city!;
  const leaders = posts.filter((p) => p.is_leader && p.neighborhood);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <HubJsonLd name={`${tr("city.top")} ${city}`} url={`/city/${slug}`} posts={posts} />
      <h1 className="text-2xl font-bold">{tr("city.top")} {city}</h1>
      <p className="text-sm text-dim">{posts[0].country}</p>

      {leaders.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-bold text-dim">{tr("city.regions")}</h2>
          <div className="flex flex-wrap gap-2">
            {leaders.map((p) => (
              <Link key={p.region_key} href={`/city/${slug}/${p.region_key}`} className="chip border border-white/15 hover:border-accent">
                {p.neighborhood} · ▲{p.votes}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => <PostCard key={p.id} post={p} lang={lang} rank={i + 1} />)}
      </div>
    </div>
  );
}
