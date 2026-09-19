import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// OAuth(code) 와 매직링크(token_hash) 둘 다 처리. 프로필 없으면 /onboarding.
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const next = url.searchParams.get("next") ?? "/";
  const supabase = await createClient();

  const code = url.searchParams.get("code");
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : token_hash && type
      ? await supabase.auth.verifyOtp({ token_hash, type })
      : { error: new Error("missing code") };
  if (error) return NextResponse.redirect(new URL("/login", url.origin));

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("id").eq("id", user!.id).maybeSingle();
  return NextResponse.redirect(new URL(profile ? next : `/onboarding?next=${encodeURIComponent(next)}`, url.origin));
}
