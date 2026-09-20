// Fulfilment rules for Sabi Spice. Edit the numbers below to match your real pricing.
export type Fulfillment = "PICKUP" | "DELIVERY" | "SHIPPING";

export const PERISHABLE_CATEGORIES = ["food-boxes", "small-chops"]; // cooked food: pickup / local delivery only
export const DELIVERY_FEE = 6.99;
export const FREE_DELIVERY_OVER = 75;
export const SHIPPING_FEE = 5.99;
export const FREE_SHIPPING_OVER = 50;

export const FULFILLMENT_LABELS: Record<Fulfillment, { title: string; desc: string }> = {
  PICKUP: { title: "Pickup", desc: "Collect your order from us — free" },
  DELIVERY: { title: "Local delivery", desc: `Fresh food to your door (free over $${FREE_DELIVERY_OVER})` },
  SHIPPING: { title: "Ship nationwide", desc: `Dry spices & leaves only (free over $${FREE_SHIPPING_OVER})` },
};

export function shippingFee(method: Fulfillment, subtotal: number): number {
  if (method === "PICKUP") return 0;
  if (method === "DELIVERY") return subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  return subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
}

export function hasPerishable(items: { product: { category?: { slug: string } | null } }[]): boolean {
  return items.some((i) => i.product.category && PERISHABLE_CATEGORIES.includes(i.product.category.slug));
}

export const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
