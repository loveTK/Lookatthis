import Link from "next/link";
import { getLang, t } from "@/lib/i18n";

export default async function NotFound() {
  const tr = t(await getLang());
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight">{tr("notfound.title")}</h1>
      <p className="mt-2 text-dim">{tr("notfound.body")}</p>
      <Link href="/" className="btn-accent mt-6">{tr("nav.map")}</Link>
    </div>
  );
}
