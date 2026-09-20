"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import { shippingFee, hasPerishable, FULFILLMENT_LABELS, US_STATES, type Fulfillment } from "@/lib/shipping";

interface CartItem {
  id: string;
  quantity: number;
  product: { id: string; name: string; price: number; images: string[]; slug: string; category?: { slug: string } | null };
}

export default function CheckoutClient() {
  const router = useRouter();
  const params = useSearchParams();
  const [cart, setCart] = useState<{ items: CartItem[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [method, setMethod] = useState<Fulfillment>("PICKUP");
  const [form, setForm] = useState({ customerName: "", customerEmail: "", customerPhone: "", shippingAddress: "", city: "", state: "", zip: "", notes: "" });

  useEffect(() => {
    fetch("/api/cart").then((r) => r.json()).then(setCart).finally(() => setLoading(false));
    if (params.get("cancelled")) toast("Payment cancelled — your cart is still here.", { icon: "ℹ️" });
  }, [params]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const items = cart?.items || [];
  const perishable = hasPerishable(items);
  const canShip = !perishable;
  const activeMethod: Fulfillment = method === "SHIPPING" && !canShip ? "PICKUP" : method;
  const needsAddress = activeMethod !== "PICKUP";
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const fee = shippingFee(activeMethod, subtotal);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) return toast.error("Your cart is empty");
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, fulfillment: activeMethod }),
      });
      const data = await res.json();
      if (res.status === 401) { router.push("/login?callbackUrl=/checkout"); return; }
      if (!res.ok) throw new Error(data.error || "Failed to create order");
      window.location.href = data.url; // Stripe Checkout
    } catch (err: any) {
      setSubmitting(false);
      toast.error(err.message || "Something went wrong");
    }
  }

  if (loading) return <div className="flex justify-center py-24"><div className="w-10 h-10 border-2 border-saffron border-t-transparent rounded-full animate-spin" /></div>;
  if (!items.length) return (
    <div className="text-center py-24">
      <h2 className="font-serif text-3xl text-sabi-black mb-4">Your cart is empty</h2>
      <a href="/products" className="btn-saffron">Continue Shopping</a>
    </div>
  );

  const label = (t: string) => <label className="block text-xs tracking-widest uppercase text-sabi-grey mb-2">{t}</label>;

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-6">
          {/* 1 · How do you want it? */}
          <div className="bg-white border border-sabi-leaf/10 rounded-2xl p-7">
            <h2 className="font-serif text-xl text-sabi-black mb-5">1 · How would you like your order?</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {(Object.keys(FULFILLMENT_LABELS) as Fulfillment[]).map((m) => {
                const disabled = m === "SHIPPING" && !canShip;
                return (
                  <button type="button" key={m} disabled={disabled} onClick={() => setMethod(m)}
                    className={`text-left p-4 rounded-xl border-2 transition-colors ${activeMethod === m ? "border-saffron bg-saffron-muted" : "border-gray-200 hover:border-saffron/50"} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}>
                    <p className="font-semibold text-sabi-black text-sm">{FULFILLMENT_LABELS[m].title}</p>
                    <p className="text-xs text-sabi-grey mt-1">{FULFILLMENT_LABELS[m].desc}</p>
                  </button>
                );
              })}
            </div>
            {!canShip && <p className="text-xs text-sabi-grey mt-3">Your cart has fresh food, so shipping isn't available — choose pickup or local delivery.</p>}
            {activeMethod === "PICKUP" && process.env.NEXT_PUBLIC_PICKUP_ADDRESS && (
              <p className="text-sm text-sabi-grey mt-3">📍 Pickup: <strong className="text-sabi-black">{process.env.NEXT_PUBLIC_PICKUP_ADDRESS}</strong></p>
            )}
          </div>

          {/* 2 · Contact */}
          <div className="bg-white border border-sabi-leaf/10 rounded-2xl p-7">
            <h2 className="font-serif text-xl text-sabi-black mb-5">2 · Your details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>{label("Full Name *")}<input required value={form.customerName} onChange={(e) => set("customerName", e.target.value)} className="input-field" /></div>
              <div>{label("Phone *")}<input required type="tel" value={form.customerPhone} onChange={(e) => set("customerPhone", e.target.value)} className="input-field" placeholder="(555) 123-4567" /></div>
              <div className="sm:col-span-2">{label("Email *")}<input required type="email" value={form.customerEmail} onChange={(e) => set("customerEmail", e.target.value)} className="input-field" placeholder="Your receipt will be sent here" /></div>
            </div>
          </div>

          {/* 3 · Address */}
          {needsAddress && (
            <div className="bg-white border border-sabi-leaf/10 rounded-2xl p-7 space-y-4">
              <h2 className="font-serif text-xl text-sabi-black">3 · Delivery address</h2>
              <div>{label("Street Address *")}<input required value={form.shippingAddress} onChange={(e) => set("shippingAddress", e.target.value)} className="input-field" placeholder="123 Main St, Apt 4B" /></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="col-span-2 sm:col-span-1">{label("City *")}<input required value={form.city} onChange={(e) => set("city", e.target.value)} className="input-field" /></div>
                <div>{label("State *")}
                  <select required value={form.state} onChange={(e) => set("state", e.target.value)} className="input-field">
                    <option value="">Select…</option>{US_STATES.map((s) => <option key={s}>{s}</option>)}
                  </select></div>
                <div>{label("ZIP *")}<input required inputMode="numeric" pattern="[0-9]{5}(-[0-9]{4})?" value={form.zip} onChange={(e) => set("zip", e.target.value)} className="input-field" placeholder="12345" /></div>
              </div>
            </div>
          )}

          <div className="bg-white border border-sabi-leaf/10 rounded-2xl p-7">
            {label(activeMethod === "PICKUP" ? "Pickup time or notes (optional)" : "Order notes (optional)")}
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} className="input-field min-h-[80px] resize-none" placeholder="Allergies, spice level, gate code, preferred time…" />
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-sabi-leaf/10 rounded-2xl p-7 sticky top-32">
            <h2 className="font-serif text-xl text-sabi-black mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-14 h-14 bg-saffron-muted rounded-xl flex-shrink-0 relative overflow-hidden">
                    {item.product.images[0] ? <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><span className="font-script text-saffron text-xl">SS</span></div>}
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-saffron text-white text-[10px] font-bold flex items-center justify-center rounded-full">{item.quantity}</span>
                  </div>
                  <p className="flex-1 text-sm text-sabi-black font-medium leading-tight line-clamp-2">{item.product.name}</p>
                  <p className="text-sm font-semibold text-sabi-black">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-5 space-y-3 text-sm">
              <div className="flex justify-between text-sabi-grey"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-sabi-grey"><span>{FULFILLMENT_LABELS[activeMethod].title}</span><span>{fee === 0 ? "Free" : formatPrice(fee)}</span></div>
              <div className="border-t border-gray-100 pt-4 flex justify-between font-serif text-xl text-sabi-black font-bold"><span>Total</span><span>{formatPrice(subtotal + shippingFee(activeMethod, subtotal))}</span></div>
            </div>
            <button type="submit" disabled={submitting} className="btn-saffron w-full mt-6">
              {submitting ? "Redirecting to secure payment…" : `Pay ${formatPrice(subtotal + shippingFee(activeMethod, subtotal))}`}
            </button>
            <p className="text-xs text-sabi-grey text-center mt-4">🔒 Secure payment by Stripe</p>
          </div>
        </div>
      </div>
    </form>
  );
}
