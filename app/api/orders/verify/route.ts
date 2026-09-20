import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { markOrderPaid } from "@/lib/orders";

const CART_COOKIE = "be_cart_session";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    const result = await markOrderPaid(sessionId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    const res = NextResponse.json({ success: true, orderNumber: result.order.orderNumber });
    if (cookies().get(CART_COOKIE)?.value) res.cookies.set(CART_COOKIE, "", { maxAge: 0, path: "/" });
    return res;
  } catch (err) {
    console.error("Verify payment error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
