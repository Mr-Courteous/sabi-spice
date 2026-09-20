import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendOrderConfirmationEmail } from "@/lib/email";

/** Idempotent: confirms payment with Stripe, marks the order PAID, decrements stock, clears carts, sends email. */
export async function markOrderPaid(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent.payment_method"] });
  if (session.payment_status !== "paid") return { ok: false as const, error: "Payment not completed" };

  const order = await prisma.order.findUnique({ where: { stripeSessionId: sessionId }, include: { items: true } });
  if (!order) return { ok: false as const, error: "Order not found" };
  if (order.status !== "PENDING") return { ok: true as const, order, alreadyPaid: true };

  const paid = (session.amount_total || 0) / 100;
  if (paid + 0.005 < order.total) return { ok: false as const, error: "Payment amount mismatch" };

  const pi = session.payment_intent as any;
  const card = pi?.payment_method?.card;
  const receipt = {
    id: pi?.id, currency: (session.currency || "usd").toUpperCase(), paid_at: new Date().toISOString(),
    channel: "card", authorization: card ? { card_type: card.brand, last4: card.last4 } : null,
  };

  const claimed = await prisma.order.updateMany({
    where: { id: order.id, status: "PENDING" },
    data: { status: "PAID", paymentStatus: "paid", paymentRef: pi?.id ?? sessionId, receiptData: receipt },
  });
  if (claimed.count === 0) return { ok: true as const, order, alreadyPaid: true }; // webhook/verify race

  await prisma.$transaction(
    order.items.filter((i) => i.productId).map((i) =>
      prisma.product.update({ where: { id: i.productId! }, data: { stock: { decrement: i.quantity } } })
    )
  );
  if (order.userId) {
    const cart = await prisma.cart.findUnique({ where: { userId: order.userId } });
    if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
  await sendOrderConfirmationEmail({ ...order, paymentRef: pi?.id ?? sessionId, items: order.items }).catch((e) => console.error("Order email failed:", e));
  return { ok: true as const, order };
}
