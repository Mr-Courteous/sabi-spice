import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

const STATUS_COLORS: Record<string, string> = {
  PENDING:    "bg-yellow-50 text-yellow-700 border-yellow-200",
  PAID:       "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
  SHIPPED:    "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED:  "bg-red-50 text-red-700 border-red-200",
};

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } }, user: true },
  });
  if (!order) notFound();

  return (
    <div>
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <Link href="/admin/orders" className="text-xs text-sabi-grey hover:text-saffron transition-colors flex items-center gap-1 mb-3">← Back to Orders</Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl lg:text-3xl text-sabi-black">Order {order.orderNumber}</h1>
            <p className="text-sabi-grey text-sm mt-1">
              Placed {new Date(order.createdAt).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <span className={`self-start text-xs lg:text-sm font-medium px-3 lg:px-4 py-2 border uppercase tracking-wide ${STATUS_COLORS[order.status] || "bg-sabi-black/5 text-sabi-grey border-sabi-black/10"}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left – Items + Payment */}
        <div className="lg:col-span-2 space-y-5">
          {/* Order items */}
          <div className="bg-white border border-sabi-black/10 p-4 lg:p-6">
            <h2 className="font-serif text-lg lg:text-xl text-sabi-black mb-4 lg:mb-5">Items ({order.items.length})</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 lg:gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-10 h-10 lg:w-14 lg:h-14 bg-saffron-muted flex-shrink-0 flex items-center justify-center">
                    <span className="font-serif text-saffron text-base lg:text-xl opacity-30">SS</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sabi-black text-sm lg:text-base truncate">{item.name}</p>
                    <p className="text-xs text-sabi-grey mt-0.5">{formatPrice(item.price)} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sabi-black text-sm lg:text-base">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-sabi-black/10 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-sabi-grey">
                <span>Subtotal</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between font-serif text-lg lg:text-xl font-bold text-sabi-black border-t border-sabi-black/10 pt-3 mt-3">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-white border border-sabi-black/10 p-4 lg:p-6">
            <h2 className="font-serif text-lg lg:text-xl text-sabi-black mb-4 lg:mb-5">Payment</h2>
            <div className="space-y-3 text-sm">
              {[
                ["Fulfillment", `${order.fulfillment} · fee ${formatPrice(order.shippingFee)}`],
                ["Payment Reference", order.paymentRef || "—"],
                ["Payment Status", order.paymentStatus || "—"],
                ["Order Status", order.status],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-sabi-grey text-xs lg:text-sm">{label}</span>
                  <span className="font-medium text-sabi-black text-right text-xs lg:text-sm break-all max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right – Customer, Address, Status Update */}
        <div className="space-y-5">
          {/* Customer info */}
          <div className="bg-white border border-sabi-black/10 p-4 lg:p-6">
            <h2 className="font-serif text-lg text-sabi-black mb-4">Customer</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-saffron/15 flex items-center justify-center flex-shrink-0">
                <span className="text-saffron font-serif font-bold">{order.customerName[0]}</span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sabi-black text-sm lg:text-base truncate">{order.customerName}</p>
                {order.user && <p className="text-xs text-saffron tracking-wide">Registered Customer</p>}
              </div>
            </div>
            <div className="space-y-2 text-sm text-sabi-grey border-t border-sabi-black/10 pt-4">
              <p className="break-all">{order.customerEmail}</p>
              {order.customerPhone && <p>{order.customerPhone}</p>}
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white border border-sabi-black/10 p-4 lg:p-6">
            <h2 className="font-serif text-lg text-sabi-black mb-4">Delivery Address</h2>
            <div className="text-sm text-sabi-grey space-y-1">
              <p className="font-medium text-sabi-black">{order.customerName}</p>
              <p className="break-words">{order.shippingAddress}</p>
              <p>{[order.city, order.state].filter(Boolean).join(", ")}</p>
            </div>
            {order.notes && (
              <div className="mt-4 pt-4 border-t border-sabi-black/10">
                <p className="text-xs text-sabi-grey tracking-widest uppercase mb-1">Notes</p>
                <p className="text-sm text-sabi-grey italic break-words">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Status updater */}
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>
      </div>
    </div>
  );
}
