"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function QuickAdd({ productId, inStock = true }: { productId: string; inStock?: boolean }) {
  const [busy, setBusy] = useState(false);
  async function add(e: React.MouseEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId, quantity: 1 }) });
      if (!res.ok) throw new Error();
      toast.success("Added to your order");
      (window as any).__refreshCartCount?.();
    } catch { toast.error("Couldn't add that — try again"); }
    finally { setBusy(false); }
  }
  return (
    <button onClick={add} disabled={busy || !inStock} aria-label="Add to order" title={inStock ? "Add to order" : "Sold out"}
      className="w-9 h-9 flex-shrink-0 rounded-full bg-saffron-light border-2 border-sabi-black text-sabi-black font-bold text-lg leading-none shadow-[2px_2px_0_0_#1E2B14] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-40 transition-all">
      {busy ? "…" : "+"}
    </button>
  );
}
