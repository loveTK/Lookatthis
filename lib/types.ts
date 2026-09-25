export type Lang = "en" | "ko";

export interface FeedRow {
  id: number;
  user_id: string;
  handle: string;
  title: string;
  body: string | null;
  lang: string;
  photo_path: string;
  lat: number;
  lng: number;
  loc_source: "gps" | "ip" | "pin";
  accuracy_m: number | null;
  country: string | null;
  city: string | null;
  city_slug: string | null;
  neighborhood: string | null;
  region_key: string;
  self_price_usd: number | null;
  status: string;
  created_at: string;
  votes: number;
  appraisals: number;
  value_usd: number | null;
  is_leader: boolean;
}

export interface CommentRow {
  id: number;
  post_id: number;
  user_id: string;
  body: string;
  lang: string;
  price_usd: number | null;
  created_at: string;
  profiles: { handle: string } | null;
}

export interface Profile {
  id: string;
  handle: string;
  lang: string;
  slots: number;
}
