"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export function LoginForm({ next, labels }: { next: string; labels: Record<"email" | "magic" | "sent" | "google", string> }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const callback = () => `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function magic(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabaseBrowser().auth.signInWithOtp({ email, options: { emailRedirectTo: callback() } });
    if (error) setErr(error.message); else setSent(true);
  }
  async function google() {
    const { error } = await supabaseBrowser().auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback() } });
    if (error) setErr(error.message);
  }

  return (
    <div className="flex flex-col gap-4">
      <button onClick={google} className="btn-ghost w-full">{labels.google}</button>
      <div className="text-center text-xs text-dim">— or —</div>
      <form onSubmit={magic} className="flex flex-col gap-3">
        <input className="input" type="email" required placeholder={labels.email} value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn-accent w-full" disabled={sent}>{labels.magic}</button>
      </form>
      {sent && <p className="text-sm text-accent">{labels.sent}</p>}
      {err && <p className="text-sm text-pink">{err}</p>}
    </div>
  );
}
