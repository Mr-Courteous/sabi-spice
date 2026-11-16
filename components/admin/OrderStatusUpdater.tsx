"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const STATUS_LABELS: Record<string, string> = {
  PENDING: "⏳ Pending Payment",
  PAID: "💳 Paid",
  PROCESSING: "🔨 Processing",
  SHIPPED: "🚚 Shipped",
  DELIVERED: "✅ Delivered",
  CANCELLED: "❌ Cancelled",
};

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [loading, setLoading] = useState(false);

  async function updateStatus() {
    if (status === currentStatus) return toast("No change made");
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notifyCustomer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast.success(
        notifyCustomer
          ? `Order status updated to ${status} — customer notified`
          : `Order status updated to ${status}`
      );
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-sabi-dark p-6">
      <h2 className="font-serif text-lg text-white mb-4">Update Order Status</h2>
      <div className="space-y-2 mb-5">
        {STATUSES.map((s) => (
          <label key={s}
            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
              status === s ? "bg-saffron/15 border border-saffron/40" : "border border-white/5 hover:bg-white/5"
            }`}>
            <input
              type="radio"
              name="status"
              value={s}
              checked={status === s}
              onChange={() => setStatus(s)}
              className="accent-saffron"
            />
            <span className={`text-sm ${status === s ? "text-saffron font-medium" : "text-sabi-grey"}`}>
              {STATUS_LABELS[s]}
            </span>
          </label>
        ))}
      </div>

      <label className="flex items-center gap-3 px-3 py-2.5 mb-5 cursor-pointer border border-white/5 hover:bg-white/5 transition-colors">
        <input
          type="checkbox"
          checked={notifyCustomer}
          onChange={(e) => setNotifyCustomer(e.target.checked)}
          className="accent-saffron"
        />
        <span className="text-sm text-gray-300">
          Email customer about this update <span className="text-sabi-grey">(optional)</span>
        </span>
      </label>

      <button
        onClick={updateStatus}
        disabled={loading || status === currentStatus}
        className="btn-saffron w-full disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Updating..." : "Update Status"}
      </button>
    </div>
  );
}
