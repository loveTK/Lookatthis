import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getLang, t } from "@/lib/i18n";
import { setLang, signOut } from "@/app/actions";
import { Logo } from "./Logo";

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
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 text-[15px] font-bold tracking-tight text-accent">
          <Logo />
          <span className="text-ink">Neighbrag</span>
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
