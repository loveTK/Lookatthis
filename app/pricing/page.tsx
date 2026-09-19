import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLang, t } from "@/lib/i18n";

const PLANS = [
  { n: 1, price: "$1.99" },
  { n: 5, price: "$6.99" },
  { n: 10, price: "$11.99" },
] as const;

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/pricing");
  const { data: profile } = await supabase.from("profiles").select("slots").eq("id", user.id).maybeSingle();
  if (!profile) redirect("/onboarding?next=/pricing");
  const tr = t(await getLang());

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold">{tr("pricing.title")}</h1>
      <p className="mt-1 text-dim">{tr("pricing.free")} · {tr("pricing.have")} {profile.slots} {tr("pricing.slots")}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {PLANS.map((p) => {
          const base = process.env[`LEMONSQUEEZY_CHECKOUT_${p.n}`];
          const href = base
            ? `${base}?checkout[custom][user_id]=${user.id}&checkout[email]=${encodeURIComponent(user.email ?? "")}`
            : "#";
          return (
            <div key={p.n} className={`card flex flex-col items-center gap-3 p-6 ${p.n === 5 ? "border-accent/50" : ""}`}>
              <div className="text-4xl font-extrabold">+{p.n}</div>
              <div className="text-sm text-dim">{tr("pricing.slots")}</div>
              <div className="text-xl font-bold">{p.price}</div>
              <a href={href} className={p.n === 5 ? "btn-accent w-full" : "btn-ghost w-full"} aria-disabled={!base}>{tr("pricing.buy")}</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
