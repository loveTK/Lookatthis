import { createHmac, timingSafeEqual } from "node:crypto";

export function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(digest), b = Buffer.from(signature.trim().toLowerCase());
  return a.length === b.length && timingSafeEqual(a, b);
}

export interface Order { orderId: string; userId: string; slots: number; amountUsd: number }

/** Lemon Squeezy order_created payload → 우리 결제 행. 모르는 variant / user_id 없음 → null */
export function parseOrder(payload: unknown, variantSlots: Record<string, number>): Order | null {
  const p = payload as {
    meta?: { event_name?: string; custom_data?: { user_id?: string } };
    data?: { id?: string; attributes?: { first_order_item?: { variant_id?: number | string }; total_usd?: number; status?: string } };
  };
  if (p?.meta?.event_name !== "order_created") return null;
  const userId = p.meta?.custom_data?.user_id;
  const orderId = p.data?.id;
  const variant = String(p.data?.attributes?.first_order_item?.variant_id ?? "");
  const slots = variantSlots[variant];
  if (!userId || !orderId || !slots) return null;
  if (p.data?.attributes?.status && p.data.attributes.status !== "paid") return null;
  return { orderId: `ls_${orderId}`, userId, slots, amountUsd: (p.data?.attributes?.total_usd ?? 0) / 100 };
}

export const variantSlotsFromEnv = (env: Record<string, string | undefined> = process.env): Record<string, number> =>
  Object.fromEntries(
    ([1, 5, 10] as const)
      .map((n) => [env[`LEMONSQUEEZY_VARIANT_${n}`], n] as const)
      .filter(([v]) => !!v),
  ) as Record<string, number>;
