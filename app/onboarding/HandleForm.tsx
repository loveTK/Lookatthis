"use client";

import { useActionState } from "react";
import { createProfile, type ActionState } from "@/app/actions";

export function HandleForm({ labels }: { labels: Record<"save" | "taken" | "generic", string> }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(createProfile, {});
  return (
    <form action={action} className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-dim">@</span>
        <input className="input" name="handle" required pattern="[a-z0-9_]{3,20}" placeholder="your_handle" autoFocus />
      </div>
      <button className="btn-accent" disabled={pending}>{labels.save}</button>
      {state.error && <p className="text-sm text-pink">{state.error === "onboarding.taken" ? labels.taken : labels.generic}</p>}
    </form>
  );
}
