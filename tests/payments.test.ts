import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { parseOrder, variantSlotsFromEnv, verifySignature } from "../lib/payments.ts";

const secret = "whsec_test";
const payload = {
  meta: { event_name: "order_created", custom_data: { user_id: "u-1" } },
  data: { id: "123", attributes: { status: "paid", total_usd: 699, first_order_item: { variant_id: 555 } } },
};
const raw = JSON.stringify(payload);

test("signature: valid passes, tampered fails", () => {
  const sig = createHmac("sha256", secret).update(raw).digest("hex");
  assert.equal(verifySignature(raw, sig, secret), true);
  assert.equal(verifySignature(raw + " ", sig, secret), false);
  assert.equal(verifySignature(raw, null, secret), false);
});

test("parseOrder maps variant → slots, cents → usd, ignores unknown", () => {
  const slots = variantSlotsFromEnv({ LEMONSQUEEZY_VARIANT_5: "555" });
  assert.deepEqual(parseOrder(payload, slots), { orderId: "ls_123", userId: "u-1", slots: 5, amountUsd: 6.99 });
  assert.equal(parseOrder(payload, { "999": 1 }), null);
  assert.equal(parseOrder({ ...payload, meta: { event_name: "order_refunded" } }, slots), null);
});
