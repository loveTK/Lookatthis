import { notFound } from "next/navigation";
import { feedWhere } from "@/lib/data";
import { getLang, t } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { PostCard } from "@/app/components/PostCard";

export default async function ProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("id, handle, slots, created_at").eq("handle", handle).maybeSingle();
  if (!profile) notFound();
  const posts = await feedWhere("handle", handle);
  const lang = await getLang();
  const tr = t(lang);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">@{profile.handle}</h1>
        <span className="text-sm text-dim">{tr("upload.inventory")} {posts.length}/{profile.slots}</span>
      </div>
      <h2 className="mb-3 text-sm font-bold text-dim">{tr("profile.posts")}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <PostCard key={p.id} post={p} lang={lang} />)}
      </div>
    </div>
  );
}
