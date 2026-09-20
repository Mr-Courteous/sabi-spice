import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { stripe, siteUrl } from "@/lib/stripe";
import { shippingFee, hasPerishable, type Fulfillment } from "@/lib/shipping";


export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;

    if (!userId) {
      return NextResponse.json({ error: "Please sign in to place an order" }, { status: 401 });
    }

    const body = await req.json();
    const { customerName, customerEmail, customerPhone, notes } = body;
    const fulfillment = body.fulfillment as Fulfillment;
    if (!["PICKUP", "DELIVERY", "SHIPPING"].includes(fulfillment)) {
      return NextResponse.json({ error: "Choose pickup, delivery or shipping" }, { status: 400 });
    }
    const needsAddress = fulfillment !== "PICKUP";
    if (!customerName || !customerEmail || !customerPhone || (needsAddress && !(body.shippingAddress && body.city && body.state && body.zip))) {
      return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: { include: { category: true } } } } } });
    if (!cart || cart.items.length === 0) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    const items = cart.items;

    for (const item of items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for "${item.product.name}". Only ${item.product.stock} available.` }, { status: 400 });
      }
    }
    if (fulfillment === "SHIPPING" && hasPerishable(items)) {
      return NextResponse.json({ error: "Fresh food can't be shipped — choose pickup or local delivery, or remove the food items." }, { status: 400 });
    }

    // Prices and fees are always computed on the server
    const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const fee = shippingFee(fulfillment, subtotal);
    const total = Math.round((subtotal + fee) * 100) / 100;
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber, userId, customerName, customerEmail, customerPhone, notes, fulfillment,
        shippingAddress: needsAddress ? body.shippingAddress : (process.env.NEXT_PUBLIC_PICKUP_ADDRESS || "Pickup — we'll email you the details"),
        city: needsAddress ? body.city : "", state: needsAddress ? body.state : "", zip: needsAddress ? body.zip : null,
        shippingFee: fee, total, status: "PENDING",
        items: { create: items.map((i) => ({ productId: i.productId, name: i.product.name, price: i.product.price, quantity: i.quantity, image: i.product.images[0] || null })) },
      },
    });

    const feeLabel = fulfillment === "DELIVERY" ? "Local delivery" : "Shipping";
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      client_reference_id: order.id,
      metadata: { orderNumber },
      line_items: [
        ...items.map((i) => ({
          quantity: i.quantity,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(i.product.price * 100),
            product_data: { name: i.product.name, ...(i.product.images[0]?.startsWith("http") ? { images: [i.product.images[0]] } : {}) },
          },
        })),
        ...(fee > 0 ? [{ quantity: 1, price_data: { currency: "usd", unit_amount: Math.round(fee * 100), product_data: { name: feeLabel } } }] : []),
      ],
      success_url: `${siteUrl()}/order-confirmation?order=${orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/checkout?cancelled=1`,
    });
    await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: checkout.id } });

    return NextResponse.json({ url: checkout.url, orderNumber }, { status: 201 });
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = (session.user as any)?.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
