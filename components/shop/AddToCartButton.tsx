"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AddToCartButton({ productId, inStock }: { productId: string; inStock: boolean }) {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  if (isAdmin) {
    return (
      <p className="text-xs text-sabi-grey border-2 border-sabi-black/10 px-4 py-3 text-center rounded-xl bg-white">
        Carting is disabled for admin accounts.
      </p>
    );
  }

  async function addToCart() {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: qty }),
      });
      if (!res.ok) throw new Error();
      toast.success("Added to cart!");
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      // Refresh navbar cart count
      if ((window as any).__refreshCartCount) (window as any).__refreshCartCount();
    } catch {
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!inStock) {
    return (
      <div className="space-y-3">
        <button disabled className="btn-saffron w-full opacity-50 cursor-not-allowed">Out of Stock</button>
        <Link href="/contact" className="btn-outline w-full text-center text-sm block">Notify Me When Available</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-xs tracking-widest uppercase text-sabi-grey w-20 font-semibold">Quantity</label>
        <div className="flex items-center border-2 border-sabi-black rounded-xl overflow-hidden bg-white shadow-[2px_2px_0_0_#101840]">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-saffron-muted text-sabi-black text-xl font-bold transition-colors">−</button>
          <span className="w-12 text-center text-sm font-bold text-sabi-black">{qty}</span>
          <button type="button" onClick={() => setQty(qty + 1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-saffron-muted text-sabi-black text-xl font-bold transition-colors">+</button>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={addToCart} disabled={loading}
          className={`btn-saffron flex-1 transition-all ${added ? "bg-sabi-leaf border-sabi-black text-white" : ""}`}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Adding...
            </span>
          ) : added ? "✓ Added to Order!" : "Add to Order"}
        </button>
        <Link href="/cart" className="btn-outline px-4 flex items-center justify-center" title="View Cart">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </Link>
      </div>
      <p className="text-xs text-sabi-grey text-center font-medium">Freshly prepared · Fast pickup &amp; delivery</p>
    </div>
  );
}
