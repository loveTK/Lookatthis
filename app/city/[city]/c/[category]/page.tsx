import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { feedCityCategory } from "@/lib/data";
import { getLang, t } from "@/lib/i18n";
import { CATEGORY_NAME, isCategory } from "@/lib/category";
import { PostCard } from "@/app/components/PostCard";
import { HubJsonLd } from "../../../HubJsonLd";

type Props = { params: Promise<{ city: string; category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, category } = await params;
  if (!isCategory(category)) return {};
  const posts = await feedCityCategory(city, category, 1);
  const p = posts[0];
  if (!p?.city) return {};
  const noun = CATEGORY_NAME[category].en;
  return {
    title: `Hidden gem ${noun} in ${p.city}, ranked by locals`,
    description: `Hidden gem ${noun} in ${p.city}, ${p.country ?? ""}: the ones locals show off, upvoted and appraised by neighbors.`,
    alternates: { canonical: `/city/${city}/c/${category}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { city: slug, category } = await params;
  if (!isCategory(category)) notFound();
  const posts = await feedCityCategory(slug, category);
  if (posts.length === 0) notFound();
  const lang = await getLang();
  const tr = t(lang);
  const city = posts[0].city!;
  const noun = CATEGORY_NAME[category][lang];
  const name = lang === "ko" ? `${city} 숨은 ${noun}` : `Hidden gem ${noun} in ${city}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <HubJsonLd name={name} url={`/city/${slug}/c/${category}`} posts={posts} />
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-sm text-dim">
        <Link href={`/city/${slug}`} className="hover:underline">{tr("city.top")} {city}</Link> · {posts[0].country}
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => <PostCard key={p.id} post={p} lang={lang} rank={i + 1} />)}
      </div>
    </div>
  );
}
