export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import CartPageClient from "@/components/shop/CartPageClient";

export const metadata: Metadata = { title: "Your order" };

export default function CartPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-8">
      <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-6">Your order</h1>
      <CartPageClient />
    </div>
  );
}
