"use client";

import { deletePost } from "@/app/actions";

export function DeleteButton({ postId, label, confirmText }: { postId: number; label: string; confirmText: string }) {
  return (
    <form action={deletePost} onSubmit={(e) => { if (!confirm(confirmText)) e.preventDefault(); }}>
      <input type="hidden" name="post_id" value={postId} />
      <button className="btn-ghost px-3! py-1! text-xs">{label}</button>
    </form>
  );
}
