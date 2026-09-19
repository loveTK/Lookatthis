import { getLang, t } from "@/lib/i18n";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const lang = await getLang();
  const tr = t(lang);
  const { next } = await searchParams;
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold">{tr("login.title")}</h1>
      <LoginForm
        next={next ?? "/"}
        labels={{ email: tr("login.email"), magic: tr("login.magic"), sent: tr("login.sent"), google: tr("login.google") }}
      />
    </div>
  );
}
