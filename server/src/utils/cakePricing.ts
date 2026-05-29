/** Flat per-cake unit pricing (₹220 per cake). */
export const CAKE_UNIT_PRICE_RS = 220;

export function computeCakePricing(_trees: number, _costPerCake?: number, quantity = 1) {
  const pricePerUnit = CAKE_UNIT_PRICE_RS;
  const totalPrice = pricePerUnit * quantity;
  return { quantity, pricePerUnit, totalPrice };
}

export function generateDeliveryOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** Always ₹220 × units — ignores stale totals saved under old pricing. */
export function normalizeEarningAmounts<T extends Record<string, unknown>>(doc: T) {
  const quantity = Number(doc.quantity ?? 1);
  const pricePerUnit = CAKE_UNIT_PRICE_RS;
  const totalPrice = pricePerUnit * quantity;
  return { ...doc, quantity, pricePerUnit, totalPrice };
}
