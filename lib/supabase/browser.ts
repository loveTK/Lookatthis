import { createBrowserClient } from "@supabase/ssr";

// 빌드 캐시 무효화용 터치(anon key 교체 후 강제 재컴파일)
export const supabaseBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
