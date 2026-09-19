"use client";

import { useState } from "react";

type Text = { title: string; body: string | null };

/** 번역본/원문 토글. 원문 언어면 토글 없이 그대로. */
export function ToggleOriginal({ original, translated, labels }: { original: Text; translated: Text; labels: { original: string; translated: string } }) {
  const [showOriginal, setShowOriginal] = useState(false);
  const same = original.title === translated.title && original.body === translated.body;
  const text = showOriginal ? original : translated;
  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">{text.title}</h1>
      {text.body && <p className="mt-3 whitespace-pre-line text-dim">{text.body}</p>}
      {!same && (
        <button onClick={() => setShowOriginal((v) => !v)} className="mt-2 text-xs text-accent hover:underline">
          {showOriginal ? labels.translated : labels.original}
        </button>
      )}
    </div>
  );
}
