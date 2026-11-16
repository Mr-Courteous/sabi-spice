import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Suspense } from "react";
import CheckoutClient from "@/components/shop/CheckoutClient";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/checkout");

  return (
    <div>
      <section className="bg-sabi-dark py-16 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 saffron-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-saffron" />
            <p className="text-saffron text-xs tracking-[0.4em] uppercase">Secure Checkout</p>
          </div>
          <h1 className="font-serif text-4xl text-white">Checkout</h1>
        </div>
      </section>

      <section className="section-padding bg-sabi-light">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <Suspense fallback={null}><CheckoutClient /></Suspense>
        </div>
      </section>
    </div>
  );
}
