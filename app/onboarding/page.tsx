import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLang, t } from "@/lib/i18n";
import { HandleForm } from "./HandleForm";

export default async function Onboarding() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding");
  const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
  if (profile) redirect("/upload");
  const tr = t(await getLang());
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-2 text-2xl font-bold">{tr("onboarding.title")}</h1>
      <p className="mb-6 text-sm text-dim">{tr("onboarding.hint")}</p>
      <HandleForm labels={{ save: tr("onboarding.save"), taken: tr("onboarding.taken"), generic: tr("err.GENERIC") }} />
    </div>
  );
}
