"use client";

import { useState } from "react";

type Props = {
  url: string;
  title: string;
  photoUrl: string;
  caption: string;
  labels: Record<"share" | "copied" | "shareFail" | "instagram" | "copyLink", string>;
};

// 인스타그램은 웹에서 여는 공유 URL이 없다. 모바일 OS 공유 시트(navigator.share)에 사진+링크를 넘기면
// 인스타 스토리/피드가 대상으로 뜬다. 캡션은 인스타가 안 받으니 클립보드에 미리 복사해 둔다.
// 나머지 서비스는 각자 공유 URL이 있어서 새 탭 링크로 충분.
export function ShareButton({ url, title, photoUrl, caption, labels }: Props) {
  const [msg, setMsg] = useState<string | null>(null);
  const u = encodeURIComponent(url), t = encodeURIComponent(title), c = encodeURIComponent(caption);
  const links: [string, string][] = [
    ["X", `https://twitter.com/intent/tweet?text=${t}&url=${u}`],
    ["Threads", `https://www.threads.net/intent/post?text=${encodeURIComponent(`${title} ${url}`)}`],
    ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${u}`],
    ["Reddit", `https://www.reddit.com/submit?url=${u}&title=${t}`],
    ["Pinterest", `https://pinterest.com/pin/create/button/?url=${u}&media=${encodeURIComponent(photoUrl)}&description=${t}`],
    ["WhatsApp", `https://wa.me/?text=${c}`],
    ["Telegram", `https://t.me/share/url?url=${u}&text=${t}`],
    ["LINE", `https://social-plugins.line.me/lineit/share?url=${u}`],
  ];

  async function copy() {
    try { await navigator.clipboard.writeText(caption); setMsg(labels.copied); } catch { setMsg(labels.shareFail); }
  }

  async function native() {
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
    <details className="relative">
      <summary className="btn-ghost cursor-pointer list-none">{labels.share}</summary>
      <div className="card absolute right-0 z-10 mt-2 flex w-64 flex-col gap-2 p-3 text-sm shadow-2xl">
        <button type="button" onClick={native} className="btn-accent w-full">{labels.instagram}</button>
        <div className="grid grid-cols-2 gap-2">
          {links.map(([name, href]) => (
            <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="btn-ghost py-1.5! text-xs">{name}</a>
          ))}
          <button type="button" onClick={copy} className="btn-ghost col-span-2 py-1.5! text-xs">{labels.copyLink}</button>
        </div>
        {msg && <p className="text-xs text-dim">{msg}</p>}
      </div>
    </details>
  );
}
