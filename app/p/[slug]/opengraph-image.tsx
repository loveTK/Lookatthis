import { ImageResponse } from "next/og";
import { getPost } from "@/lib/data";
import { idFromSlug, money } from "@/lib/slug";
import { photoUrl } from "@/lib/supabase/admin";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const id = idFromSlug((await params).slug);
  const post = id ? await getPost(id) : null;
  const place = post ? [post.neighborhood, post.city].filter(Boolean).join(", ") : "";
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#0a0d12", color: "#eef1f6", fontFamily: "sans-serif" }}>
        {post && (
          <img src={photoUrl(post.photo_path)} alt="" width={630} height={630} style={{ objectFit: "cover" }} />
        )}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 48, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, color: "#43ffa1", fontWeight: 700 }}>
            {post?.is_leader ? "#1 · " : ""}Neighbrag
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>{post?.title ?? "Neighbrag"}</div>
            <div style={{ fontSize: 28, color: "#9aa3b2" }}>{place}</div>
          </div>
          <div style={{ display: "flex", gap: 32, fontSize: 32 }}>
            <span>▲ {post?.votes ?? 0}</span>
            <span style={{ color: "#43ffa1", fontWeight: 700 }}>{post?.value_usd != null ? money(post.value_usd) : "-"}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
