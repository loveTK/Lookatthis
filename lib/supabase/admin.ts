import { createClient } from "@supabase/supabase-js";

// 서비스 롤: RLS 우회. 스토리지 업로드, 번역 캐시, 결제 웹훅에서만 사용.
export const supabaseAdmin = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });

export const photoUrl = (path: string) =>
  path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${path}`;
