import { supabaseAdmin } from "@/lib/supabase/admin";
import { parseOrder, variantSlotsFromEnv, verifySignature } from "@/lib/payments";

// Lemon Squeezy 웹훅. payments insert 한 줄 → 트리거가 slots 증가. 중복 주문 = PK 충돌 → 200.
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifySignature(raw, req.headers.get("x-signature"), process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? "")) {
    return new Response("bad signature", { status: 401 });
  }
  const order = parseOrder(JSON.parse(raw), variantSlotsFromEnv());
  if (!order) return new Response("ignored", { status: 200 });

  const { error } = await supabaseAdmin().from("payments").insert({
    id: order.orderId, user_id: order.userId, slots_added: order.slots, amount_usd: order.amountUsd,
  });
  if (error && error.code !== "23505") return new Response(error.message, { status: 500 });
  return new Response("ok", { status: 200 });
}
