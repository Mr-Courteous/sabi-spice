import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import CartCountRefresher from "@/components/shop/CartCountRefresher";
import PendingOrderRefresher from "@/components/shop/PendingOrderRefresher";
import VerifyOnMount from "@/components/shop/VerifyOnMount";
import DownloadReceiptButton from "@/components/shop/DownloadReceiptButton";

export const metadata: Metadata = { title: "Order Confirmed!" };

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { order?: string; session_id?: string };
}) {
  if (!searchParams.order) notFound();

  const order = await prisma.order.findUnique({
    where: { orderNumber: searchParams.order },
    include: { items: true },
  });

  if (!order) notFound();

  const isPending = order.status === "PENDING";

  const isPaid = order.status === "PAID";

  return (
    <div>
      <CartCountRefresher />
      {isPending && <PendingOrderRefresher interval={5000} />}
      {isPending && searchParams.session_id && (
        <VerifyOnMount orderNumber={searchParams.order} sessionId={searchParams.session_id} isPending={isPending} />
      )}
      <section className="bg-sabi-black py-16 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 saffron-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <div className={`w-20 h-20 border-2 flex items-center justify-center mx-auto mb-6 ${isPending ? "border-yellow-500" : "border-saffron"}`}>
            {isPending ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-saffron" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <p className={`text-xs tracking-[0.4em] uppercase mb-3 ${isPending ? "text-yellow-500" : "text-saffron"}`}>
            {isPending ? "Payment Processing" : "Payment Successful"}
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl text-white mb-3">
            {isPending ? "Payment Received!" : "Order Confirmed!"}
          </h1>
          <p className="text-gray-400 text-lg">
            {isPending
              ? "Your payment is being confirmed. This page will update automatically."
              : "Thank you for shopping with Sabi Spice."}
          </p>
          <div className="mt-5 inline-block bg-saffron/10 border border-saffron/30 px-6 py-3">
            <p className="text-xs text-saffron tracking-widest uppercase mb-1">Order Number</p>
            <p className="font-mono font-bold text-white text-xl tracking-wider">{order.orderNumber}</p>
          </div>
          {isPaid && (
            <div className="mt-4">
              <DownloadReceiptButton orderNumber={order.orderNumber} />
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-sabi-light">
        <div className="container-max px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-100 p-6">
              <h2 className="font-serif text-lg text-sabi-black mb-4">Order Details</h2>
              <div className="space-y-3 text-sm">
                  {[
                    ["Order Number", order.orderNumber],
                    ["Status", isPending ? "PENDING" : "PAID"],
                  ["Date", new Date(order.createdAt).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
                  ["Payment Ref", order.paymentRef || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-sabi-grey flex-shrink-0">{label}</span>
                    <span className={`font-medium text-right ${label === "Status" ? (isPending ? "text-yellow-600" : "text-emerald-600") + " uppercase text-xs tracking-wide" : "text-sabi-black break-all max-w-[60%]"}`}>{value}</span>
                  </div>
                ))}
              </div>
              {isPaid && <DownloadReceiptButton orderNumber={order.orderNumber} />}
            </div>

            <div className="bg-white border border-gray-100 p-6">
              <h2 className="font-serif text-lg text-sabi-black mb-4">Delivery To</h2>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-sabi-black">{order.customerName}</p>
                <p className="text-sabi-grey">{order.customerEmail}</p>
                {order.customerPhone && <p className="text-sabi-grey">{order.customerPhone}</p>}
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sabi-grey">{order.shippingAddress}</p>
                  <p className="text-sabi-grey">{[order.city, order.state].filter(Boolean).join(", ")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 mb-6">
            <h2 className="font-serif text-lg text-sabi-black mb-5">Items Ordered</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-14 h-14 bg-saffron-muted flex-shrink-0 flex items-center justify-center">
                    <span className="font-serif text-xl text-saffron opacity-30">SS</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sabi-black">{item.name}</p>
                    <p className="text-xs text-sabi-grey">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <p className="font-semibold text-sabi-black">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-serif text-xl font-bold text-sabi-black">
              <span>Total Paid</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="bg-sabi-charcoal p-7 mb-8">
            <h3 className="font-serif text-xl text-white mb-5">{isPending ? "What's happening?" : "What Happens Next?"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {isPending
                ? [
                    { icon: "⏳", title: "Confirming Payment", desc: "We're verifying your payment with Stripe. This page refreshes every 5 seconds." },
                    { icon: "🔄", title: "Auto-Refresh", desc: "Once confirmed, this page will update automatically. No need to reload manually." },
                    { icon: "📩", title: "Receipt Sent", desc: `A payment receipt will be emailed to ${order.customerEmail} once confirmed.` },
                  ].map((s) => (
                    <div key={s.title} className="text-center">
                      <span className="text-3xl block mb-3">{s.icon}</span>
                      <p className="font-sans font-semibold text-white text-sm mb-1">{s.title}</p>
                      <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
                    </div>
                  ))
                : [
                    { icon: "✉️", title: "Confirmation Email", desc: "A receipt has been sent to your email address." },
                    { icon: "📦", title: "Order Processing", desc: "We'll start preparing your order within 24 hours." },
                    { icon: "🚚", title: "Delivery", desc: order.fulfillment === "PICKUP" ? "We'll email you when your order is ready for pickup." : order.fulfillment === "DELIVERY" ? "Local delivery — we'll confirm your delivery window by email." : `Shipping to ${order.state} — typically 3–7 business days.` },
                  ].map((s) => (
                    <div key={s.title} className="text-center">
                      <span className="text-3xl block mb-3">{s.icon}</span>
                      <p className="font-sans font-semibold text-white text-sm mb-1">{s.title}</p>
                      <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products" className="btn-saffron">Continue Shopping</Link>
            {!isPending && <Link href="/account/orders" className="btn-outline">View My Orders</Link>}
            <Link href="/contact" className="btn-dark">Need Help?</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
