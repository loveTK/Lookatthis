import { cookies, headers } from "next/headers";
import en from "@/messages/en.json";
import ko from "@/messages/ko.json";
import type { Lang } from "./types";

const dict: Record<Lang, Record<string, string>> = { en, ko };
export const LANGS: Lang[] = ["en", "ko"];

export async function getLang(): Promise<Lang> {
  const c = (await cookies()).get("lang")?.value;
  if (c === "en" || c === "ko") return c;
  const al = (await headers()).get("accept-language") ?? "";
  return al.toLowerCase().startsWith("ko") ? "ko" : "en";
}

export const t = (lang: Lang) => (key: string) => dict[lang][key] ?? dict.en[key] ?? key;
