"use client";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

interface CartItem {
  id: string;
  quantity: number;
  product: { id: string; name: string; price: number; images: string[]; slug: string; stock: number };
}

export default function CartPageClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCart() {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCart(); }, []);

  async function updateQty(itemId: string, quantity: number) {
    if (quantity < 1) return removeItem(itemId);
    await fetch("/api/cart", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemId, quantity }) });
    loadCart();
  }

  async function removeItem(itemId: string) {
    await fetch(`/api/cart?itemId=${itemId}`, { method: "DELETE" });
    toast.success("Item removed");
    loadCart();
  }

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  if (loading) return (
    <div className="text-center py-24">
      <div className="w-8 h-8 border-2 border-saffron border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  );

  if (items.length === 0) return (
    <div className="text-center py-24 max-w-md mx-auto">
      <span className="text-7xl block">🍽</span>
      <h2 className="font-serif text-3xl text-sabi-black mt-6 mb-3">Your order is empty</h2>
      <p className="text-sabi-grey mb-8">Pick something tasty from the menu and it will show up here.</p>
      <Link href="/products" className="btn-saffron">Browse the menu</Link>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Items */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-surface rounded-3xl ring-1 ring-sabi-black/5 shadow-soft p-4 sm:p-5 flex gap-4 sm:gap-5">
            <div className="w-20 h-20 rounded-2xl bg-saffron-muted flex-shrink-0 relative overflow-hidden">
              {item.product.images[0] ? (
                <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-serif text-2xl text-saffron opacity-30">SS</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.product.slug}`} className="font-serif text-lg text-sabi-black hover:text-saffron transition-colors line-clamp-1">{item.product.name}</Link>
              <p className="font-semibold text-sabi-black mt-1">{formatPrice(item.product.price)}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center rounded-full border border-sabi-black/15 overflow-hidden">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-saffron-muted text-sm">−</button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-saffron-muted text-sm">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-xs font-semibold text-saffron-dark hover:underline">Remove</button>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
            </div>
          </div>
        ))}
        <Link href="/products" className="text-sm font-semibold text-sabi-leaf hover:underline flex items-center gap-2 mt-2">Add more dishes</Link>
      </div>

      {/* Summary */}
      <div>
        <div className="bg-surface rounded-3xl ring-1 ring-sabi-black/5 shadow-soft p-6 sm:p-7 sticky top-28">
          <h3 className="font-serif text-xl text-sabi-black mb-6">Order Summary</h3>
          <div className="space-y-3 text-sm border-b border-sabi-black/10 pb-5 mb-5">
            <div className="flex justify-between text-sabi-grey">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sabi-grey">
              <span>Shipping</span>
              <span className="text-emerald-600">Calculated at checkout</span>
            </div>
          </div>
          <div className="flex justify-between font-serif text-lg text-sabi-black font-bold mb-6">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Link href="/checkout" className="btn-saffron w-full text-center">Checkout</Link>
          <p className="text-xs text-sabi-grey text-center mt-4">Secure checkout via Stripe</p>
        </div>
      </div>
    </div>
  );
}
