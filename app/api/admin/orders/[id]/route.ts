import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderStatusUpdateEmail } from "@/lib/email";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const { status, notifyCustomer } = await req.json();
    const validStatuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    });

    if (notifyCustomer) {
      // Fire-and-forget-ish, but await so failures are logged, not silent —
      // a failed email should never fail the status update itself.
      await sendOrderStatusUpdateEmail({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        status: order.status,
      });
    }

    return NextResponse.json(order);
  } catch (err: any) {
    if (err.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true, user: true },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (err: any) {
    if (err.message === "Unauthorized") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
