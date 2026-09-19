import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getLang, t } from "@/lib/i18n";
import { setLang, signOut } from "@/app/actions";

export async function Header() {
  const lang = await getLang();
  const tr = t(lang);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const handle = user
    ? (await supabase.from("profiles").select("handle").eq("id", user.id).maybeSingle()).data?.handle
    : null;
  const next = (await headers()).get("x-pathname") ?? "/";

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <Pin />
          Look At This
        </Link>
        <nav className="flex items-center gap-3 text-sm font-semibold text-dim">
          <Link href="/upload" className="btn-accent py-1.5!">{tr("nav.upload")}</Link>
          <Link href="/pricing" className="hidden sm:inline hover:text-ink">{tr("nav.pricing")}</Link>
          <form action={setLang}>
            <input type="hidden" name="lang" value={lang === "ko" ? "en" : "ko"} />
            <input type="hidden" name="next" value={next} />
            <button className="chip border border-white/15 text-dim hover:text-ink">{lang === "ko" ? "EN" : "한국어"}</button>
          </form>
          {user ? (
            <>
              <Link href={handle ? `/u/${handle}` : "/onboarding"} className="hover:text-ink">@{handle ?? "…"}</Link>
              <form action={signOut}><button className="hover:text-ink">{tr("nav.logout")}</button></form>
            </>
          ) : (
            <Link href="/login" className="hover:text-ink">{tr("nav.login")}</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export function Pin({ className = "text-accent" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
