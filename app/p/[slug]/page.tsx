import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { appraisalRange, getComments, getPost } from "@/lib/data";
import { getLang, t } from "@/lib/i18n";
import { idFromSlug, money, postPath } from "@/lib/slug";
import { photoUrl } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { translateMany } from "@/lib/translate";
import { addComment, report, toggleVote } from "@/app/actions";
import { ToggleOriginal } from "./ToggleOriginal";

type Props = { params: Promise<{ slug: string }> };

const isThin = (p: { votes: number; appraisals: number }) => p.votes === 0 && p.appraisals === 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = idFromSlug((await params).slug);
  const post = id ? await getPost(id) : null;
  if (!post) return {};
  const lang = await getLang();
  const [tr] = [t(lang)];
  const place = [post.neighborhood, post.city].filter(Boolean).join(", ");
  const value = post.value_usd != null ? money(post.value_usd) : tr("post.pending");
  return {
    title: place ? `${post.title} in ${place}` : post.title,
    description: `${place} · @${post.handle} · ▲${post.votes} · ${tr("post.value")}: ${value}`,
    alternates: { canonical: postPath(post.id, post.title) },
    robots: isThin(post) ? { index: false, follow: true } : undefined,
    openGraph: { type: "article", title: post.title, description: `${place} · ▲${post.votes} · ${value}` },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const id = idFromSlug(slug);
  const post = id ? await getPost(id) : null;
  if (!post) notFound();
  const path = postPath(post.id, post.title);
  if (`/p/${slug}` !== path) redirect(path);

  const lang = await getLang();
  const tr = t(lang);
  const supabase = await createClient();
  const [{ data: { user } }, comments] = await Promise.all([supabase.auth.getUser(), getComments(post.id)]);
  const voted = user
    ? !!(await supabase.from("votes").select("post_id").eq("post_id", post.id).eq("user_id", user.id).maybeSingle()).data
    : false;

  const [postTr, commentTr] = await Promise.all([
    translateMany("post", [{ id: post.id, lang: post.lang, title: post.title, body: post.body }], lang),
    translateMany("comment", comments.map((c) => ({ id: c.id, lang: c.lang, body: c.body })), lang),
  ]);
  const translated = postTr.get(post.id)!;
  const range = appraisalRange(post, comments);
  const place = [post.neighborhood, post.city, post.country].filter(Boolean).join(", ");
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: post.title,
    description: post.body ?? undefined,
    contentUrl: photoUrl(post.photo_path),
    url: `${site}${path}`,
    datePublished: post.created_at,
    author: { "@type": "Person", name: `@${post.handle}`, url: `${site}/u/${post.handle}` },
    contentLocation: {
      "@type": "Place",
      name: place || post.region_key,
      geo: { "@type": "GeoCoordinates", latitude: post.lat, longitude: post.lng },
    },
    interactionStatistic: [
      { "@type": "InteractionCounter", interactionType: "https://schema.org/LikeAction", userInteractionCount: post.votes },
      { "@type": "InteractionCounter", interactionType: "https://schema.org/CommentAction", userInteractionCount: comments.length },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="card relative overflow-hidden">
        <div className="relative aspect-[4/3] bg-black/30">
          <Image src={photoUrl(post.photo_path)} alt={`${post.title}, ${place}`} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
        </div>
        <div className="absolute left-3 top-3 flex gap-2">
          {post.is_leader && <span className="chip bg-accent text-accent-ink">🏆 {tr("post.leader")}</span>}
          {post.loc_source === "ip" && <span className="chip bg-black/60 text-dim">{tr("post.approx")}</span>}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <ToggleOriginal
            original={{ title: post.title, body: post.body }}
            translated={{ title: translated.title ?? post.title, body: translated.body }}
            labels={{ original: tr("post.original"), translated: tr("post.translated") }}
          />
          <p className="mt-3 text-sm text-dim">
            {tr("post.by")} <Link href={`/u/${post.handle}`} className="text-ink hover:underline">@{post.handle}</Link>
            {post.city_slug && <> · <Link href={post.neighborhood ? `/city/${post.city_slug}/${post.region_key}` : `/city/${post.city_slug}`} className="hover:underline">{[post.neighborhood, post.city].filter(Boolean).join(", ")}</Link></>}
          </p>
        </div>

        <form action={toggleVote}>
          <input type="hidden" name="post_id" value={post.id} />
          <input type="hidden" name="path" value={path} />
          <button className={voted ? "btn-accent" : "btn-ghost"} aria-pressed={voted}>
            ▲ {post.votes} <span className="font-normal">{voted ? tr("post.unvote") : tr("post.upvote")}</span>
          </button>
        </form>
      </div>

      {/* 감정가 */}
      <section className="card mt-6 grid grid-cols-3 divide-x divide-line text-center">
        <Stat label={tr("post.low")} value={range ? money(range.low) : "—"} />
        <Stat label={tr("post.value")} value={post.value_usd != null ? money(post.value_usd) : `${tr("post.pending")} ${post.appraisals}/3`} accent={post.value_usd != null} />
        <Stat label={tr("post.high")} value={range ? money(range.high) : "—"} />
      </section>
      {post.self_price_usd != null && (
        <p className="mt-2 text-right text-xs text-dim">{tr("post.selfPrice")}: {money(post.self_price_usd)}</p>
      )}

      {/* 댓글 */}
      <section className="mt-8">
        <h2 className="mb-3 font-bold">{tr("post.comments")} ({comments.length})</h2>
        <ul className="flex flex-col gap-3">
          {comments.map((c) => {
            const text = commentTr.get(c.id)?.body ?? c.body;
            return (
              <li key={c.id} className="card p-4 text-sm">
                <div className="mb-1 flex items-center gap-2 text-xs text-dim">
                  <Link href={`/u/${c.profiles?.handle}`} className="text-ink hover:underline">@{c.profiles?.handle}</Link>
                  {c.price_usd != null && <span className="chip bg-accent/15 text-accent">{money(c.price_usd)}</span>}
                  <form action={report} className="ml-auto">
                    <input type="hidden" name="comment_id" value={c.id} />
                    <input type="hidden" name="path" value={path} />
                    <input type="hidden" name="reason" value="spam" />
                    <button className="hover:text-ink">{tr("post.report")}</button>
                  </form>
                </div>
                <p className="whitespace-pre-line">{text}</p>
                {text !== c.body && <details className="mt-1 text-xs text-dim"><summary className="cursor-pointer">{tr("post.original")}</summary>{c.body}</details>}
              </li>
            );
          })}
        </ul>

        <form action={addComment} className="card mt-4 flex flex-col gap-3 p-4">
          <input type="hidden" name="post_id" value={post.id} />
          <input type="hidden" name="path" value={path} />
          <textarea className="input" name="body" rows={2} required maxLength={500} placeholder={tr("post.comment.body")} />
          <div className="flex gap-3">
            <input className="input" name="price" inputMode="decimal" placeholder={tr("post.comment.price")} />
            <button className="btn-accent shrink-0">{tr("post.comment.send")}</button>
          </div>
        </form>

        <form action={report} className="mt-6 flex items-center justify-end gap-2 text-xs text-dim">
          <input type="hidden" name="post_id" value={post.id} />
          <input type="hidden" name="path" value={path} />
          <select name="reason" className="input w-auto! py-1! text-xs">
            {["adult", "violence", "spam", "privacy", "copyright"].map((r) => <option key={r} value={r}>{tr(`report.${r}`)}</option>)}
          </select>
          <button className="btn-ghost px-3! py-1! text-xs">{tr("post.report")}</button>
        </form>
      </section>
    </article>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | null; accent?: boolean }) {
  return (
    <div className="px-2 py-4">
      <div className="text-xs text-dim">{label}</div>
      <div className={`mt-1 text-lg font-bold ${accent ? "text-accent" : ""}`}>{value}</div>
    </div>
  );
}
