"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import Icon from "@/components/ui/Icon";

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
      className="w-10 h-10 flex-shrink-0 rounded-full bg-[#F6EEE2] text-[#0B0907] shadow-lift grid place-items-center hover:bg-saffron hover:text-[rgb(var(--on-accent))] active:scale-90 disabled:opacity-40 disabled:hover:bg-[#F6EEE2] disabled:hover:text-[#0B0907] transition-all">
      {busy ? <span className="w-4 h-4 rounded-full border-2 border-sabi-black/20 border-t-saffron animate-spin" /> : <Icon name="plus" className="w-5 h-5" />}
    </button>
  );
}
