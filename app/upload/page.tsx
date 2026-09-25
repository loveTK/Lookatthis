import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLang, t } from "@/lib/i18n";
import { UploadForm } from "./UploadForm";

export default async function UploadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/upload");
  const { data: profile } = await supabase.from("profiles").select("slots").eq("id", user.id).maybeSingle();
  if (!profile) redirect("/onboarding");
  const { count } = await supabase.from("posts").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "active");
  const used = count ?? 0;
  const lang = await getLang();
  const tr = t(lang);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">{tr("upload.title")}</h1>
        <span className="text-sm text-dim">{tr("upload.inventory")} {used}/{profile.slots}</span>
      </div>
      {used >= profile.slots ? (
        <div className="card p-6 text-center">
          <p className="mb-4">{tr("upload.full")}</p>
          <Link href="/pricing" className="btn-accent">{tr("upload.getSlots")}</Link>
        </div>
      ) : (
        <UploadForm
          labels={Object.fromEntries(
            ["upload.locating", "upload.gps", "upload.ip", "upload.useGps", "upload.pickOnMap", "upload.pin", "upload.pinned", "home.noMap",
             "upload.photo", "upload.name", "upload.body", "upload.price", "upload.submit",
             "err.NO_LOCATION", "err.INVENTORY_FULL", "err.DUPLICATE", "err.REJECTED", "err.TOO_LARGE", "err.BANNED", "err.GENERIC"]
              .map((k) => [k, tr(k)]),
          )}
        />
      )}
    </div>
  );
}
