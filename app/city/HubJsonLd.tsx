import { postPath } from "@/lib/slug";
import type { FeedRow } from "@/lib/types";

export function HubJsonLd({ name, url, posts }: { name: string; url: string; posts: FeedRow[] }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: `${site}${url}`,
    itemListElement: posts.slice(0, 20).map((p, i) => ({
      "@type": "ListItem", position: i + 1, name: p.title, url: `${site}${postPath(p.id, p.title)}`,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
