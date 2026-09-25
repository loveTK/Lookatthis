"use client";

import { useState } from "react";

type Props = { url: string; photoUrl: string; caption: string; labels: Record<"share" | "copied" | "shareFail", string> };

// 인스타그램은 웹에서 여는 공유 URL이 없다. 모바일 OS 공유 시트(navigator.share)에 사진+링크를 넘기면
// 인스타 스토리/피드가 대상으로 뜬다. 캡션은 인스타가 안 받으니 클립보드에 미리 복사해 둔다.
export function ShareButton({ url, photoUrl, caption, labels }: Props) {
  const [msg, setMsg] = useState<string | null>(null);

  async function share() {
    setMsg(null);
    try { await navigator.clipboard.writeText(caption); } catch {}
    if (typeof navigator.share !== "function") { setMsg(labels.copied); return; }
    let files: File[] = [];
    try {
      const blob = await fetch(photoUrl).then((r) => r.blob());
      const f = new File([blob], "lookatthis.jpg", { type: blob.type || "image/jpeg" });
      if (navigator.canShare?.({ files: [f] })) files = [f];
    } catch {}
    try {
      await navigator.share(files.length ? { files, text: caption } : { url, text: caption });
      setMsg(labels.copied);
    } catch (e) {
      if ((e as Error).name !== "AbortError") setMsg(labels.shareFail);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button type="button" onClick={share} className="btn-ghost">{labels.share}</button>
      {msg && <p className="text-xs text-dim">{msg}</p>}
    </div>
  );
}
