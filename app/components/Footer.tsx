import Link from "next/link";
import { getLang, t } from "@/lib/i18n";
import { Logo } from "./Logo";

export async function Footer() {
  const tr = t(await getLang());
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-dim sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2 text-accent"><Logo size={18} /><span className="text-dim">Neighbrag</span></span>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/pricing" className="hover:text-ink">{tr("nav.pricing")}</Link>
          <Link href="/privacy" className="hover:text-ink">{tr("footer.privacy")}</Link>
          <Link href="/terms" className="hover:text-ink">{tr("footer.terms")}</Link>
          <a href="mailto:hello@neighbrag.app" className="hover:text-ink">{tr("footer.contact")}</a>
        </nav>
      </div>
    </footer>
  );
}
