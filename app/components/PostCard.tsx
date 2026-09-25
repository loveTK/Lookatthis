import Image from "next/image";
import Link from "next/link";
import { photoUrl } from "@/lib/supabase/admin";
import { money, postPath } from "@/lib/slug";
import type { FeedRow, Lang } from "@/lib/types";
import { t } from "@/lib/i18n";

export function PostCard({ post, lang, rank }: { post: FeedRow; lang: Lang; rank?: number }) {
  const tr = t(lang);
  const place = [post.neighborhood, post.city].filter(Boolean).join(" · ");
  return (
    <Link href={postPath(post.id, post.title)} className={`card block overflow-hidden transition hover:border-white/20 active:scale-[0.98] ${post.is_leader ? "border-accent/40" : ""}`}>
      <div className="relative aspect-[4/3] bg-black/30">
        <Image src={photoUrl(post.photo_path)} alt={`${post.title}, ${place}`} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
        <div className="absolute left-3 top-3 flex gap-2">
          {rank != null && <span className={`chip ${rank === 1 ? "bg-accent text-accent-ink" : "bg-white/15"}`}>#{rank}</span>}
          {post.is_leader && rank !== 1 && <span className="chip bg-accent text-accent-ink">{tr("post.leader")}</span>}
        </div>
      </div>
      <div className="p-4">
        <h3 className="truncate font-bold">{post.title}</h3>
        <p className="truncate text-xs text-dim">
          {place || post.region_key}{post.loc_source === "ip" && ` · ${tr("post.approx")}`}{post.loc_source === "pin" && ` · ${tr("post.pinned")}`}
        </p>
        <div className="mt-3 flex justify-between text-sm">
          <span>▲ {post.votes} <span className="text-dim">{tr("post.votes")}</span></span>
          {post.value_usd != null
            ? <span className="font-bold text-accent">{money(post.value_usd)}</span>
            : <span className="text-dim">{tr("post.pending")} {post.appraisals}/3</span>}
        </div>
      </div>
    </Link>
  );
}
