import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCateringEmails } from "@/lib/email";

export const dynamic = "force-dynamic";
const clip = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

export async function POST(req: NextRequest) {
  try {
    const b = await req.json();
    const name = clip(b.name, 100), email = clip(b.email, 150), phone = clip(b.phone, 30);
    const eventType = clip(b.eventType, 60), location = clip(b.location, 150);
    const budget = clip(b.budget, 60) || null, message = clip(b.message, 2000) || null;
    const guests = parseInt(b.guests, 10);
    const eventDate = new Date(b.eventDate);

    if (!name || !/^\S+@\S+\.\S+$/.test(email) || !phone || !eventType || !location) {
      return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 });
    }
    if (!Number.isFinite(guests) || guests < 1 || guests > 5000) {
      return NextResponse.json({ error: "Enter a valid number of guests" }, { status: 400 });
    }
    if (isNaN(eventDate.getTime()) || eventDate.getTime() < Date.now() - 86400000) {
      return NextResponse.json({ error: "Choose a future event date" }, { status: 400 });
    }

    const request = await prisma.cateringRequest.create({
      data: { name, email, phone, eventType, eventDate, guests, location, budget, message },
    });
    await sendCateringEmails(request).catch((e) => console.error("Catering email failed:", e));
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Catering request error:", err);
    return NextResponse.json({ error: "Failed to send request" }, { status: 500 });
  }
}
