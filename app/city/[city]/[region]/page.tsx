import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { feedWhere } from "@/lib/data";
import { getLang, t } from "@/lib/i18n";
import { PostCard } from "@/app/components/PostCard";
import { HubJsonLd } from "../../HubJsonLd";

type Props = { params: Promise<{ city: string; region: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, region } = await params;
  const posts = await feedWhere("region_key", region, 1);
  const p = posts[0];
  if (!p || p.city_slug !== city) return {};
  const name = p.neighborhood ?? region;
  return {
    title: `${name}, ${p.city} — what it's known for, ranked by locals`,
    description: `Things to see in ${name}, ${p.city}: what locals show off, upvoted and appraised by the community.`,
    alternates: { canonical: `/city/${city}/${region}` },
  };
}

export default async function RegionPage({ params }: Props) {
  const { city, region } = await params;
  const posts = await feedWhere("region_key", region);
  if (posts.length === 0 || posts[0].city_slug !== city) notFound();
  const lang = await getLang();
  const tr = t(lang);
  const name = posts[0].neighborhood ?? region;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <HubJsonLd name={`${tr("city.top")} ${name}`} url={`/city/${city}/${region}`} posts={posts} />
      <p className="text-sm text-dim"><Link href={`/city/${city}`} className="hover:underline">{posts[0].city}</Link></p>
      <h1 className="text-2xl font-bold">{tr("city.top")} {name}</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => <PostCard key={p.id} post={p} lang={lang} rank={i + 1} />)}
      </div>
    </div>
  );
}
