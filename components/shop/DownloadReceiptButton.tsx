"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

const GOLD = "#B07A2A";
const DARK = "#1a1a1a";
const GREY = "#666";

function fmt(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

async function loadLogoBase64(): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      resolve(c.toDataURL("image/jpeg"));
    };
    img.onerror = reject;
    img.src = "/sabi-logo.png";
  });
}

export default function DownloadReceiptButton({ orderNumber }: { orderNumber: string }) {
  const [loading, setLoading] = useState(false);
  const logoRef = useRef<string | null>(null);

  useEffect(() => {
    loadLogoBase64().then((d) => { logoRef.current = d; }).catch(() => {});
  }, []);

  const handleDownload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/receipt?orderNumber=${orderNumber}`);
      if (!res.ok) throw new Error("Receipt not ready");
      const { order, paymentData } = await res.json();

      const paidAt = paymentData?.paid_at
        ? new Date(paymentData.paid_at).toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
        : new Date(order.createdAt).toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

      const channel = paymentData?.channel?.toUpperCase() || "—";
      const cardInfo = paymentData?.authorization
        ? `${paymentData.authorization.card_type?.toUpperCase() || ""} ****${paymentData.authorization.last4 || ""}`
        : "—";
      const bank = paymentData?.authorization?.bank || "—";

      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pw = doc.internal.pageSize.getWidth();
      let y = 15;

      const saffronLine = (yy: number) => {
        doc.setDrawColor(201, 168, 76);
        doc.setLineWidth(0.5);
        doc.line(15, yy, pw - 15, yy);
      };

      const sectionTitle = (title: string) => {
        y += 4;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(26, 26, 26);
        doc.text(title, 15, y);
        y += 6;
      };

      const kv = (label: string, value: string, opts?: { mono?: boolean; color?: number[] }) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(102, 102, 102);
        doc.text(label, 15, y);
        doc.setFont(opts?.mono ? "courier" : "helvetica", "normal");
        if (opts?.color) doc.setTextColor(opts.color[0], opts.color[1], opts.color[2]);
        else doc.setTextColor(26, 26, 26);
        doc.text(value, pw - 15, y, { align: "right" });
        y += 5;
      };

      // ── Logo ──
      if (logoRef.current) {
        try {
          doc.addImage(logoRef.current, "PNG", pw / 2 - 15, y, 30, 30);
          y += 34;
        } catch { y += 4; }
      } else {
        y += 4;
      }

      // ── Header ──
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(201, 168, 76);
      doc.text("SABI SPICE", pw / 2, y, { align: "center" });
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(102, 102, 102);
      doc.text("African Food & Spices", pw / 2, y, { align: "center" });
      y += 4;
      doc.setFontSize(8);
      doc.text("contact@sabispice.com", pw / 2, y, { align: "center" });
      y += 6;
      saffronLine(y);
      y += 6;

      // ── Title ──
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(26, 26, 26);
      doc.text("PAYMENT RECEIPT", pw / 2, y, { align: "center" });
      y += 8;

      // ── Order Details ──
      sectionTitle("ORDER DETAILS");
      kv("Order Number:", order.orderNumber, { mono: true });
      kv("Date:", paidAt);
      kv("Status:", "PAID", { color: [22, 163, 74] });

      // ── Customer ──
      sectionTitle("CUSTOMER");
      kv("Name:", order.customerName);
      kv("Email:", order.customerEmail);
      if (order.customerPhone) kv("Phone:", order.customerPhone);
      kv("Address:", `${order.shippingAddress}, ${[order.city, order.state].filter(Boolean).join(", ")}`);

      // ── Items Table ──
      sectionTitle("ITEMS");

      const colItem = { x: 18, w: 95 };
      const colQty = { x: 125 };
      const colPrice = { x: 162 };
      const colTotal = { x: 192 };

      // Table header
      doc.setFillColor(245, 237, 214);
      doc.rect(15, y - 3, pw - 30, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(26, 26, 26);
      doc.text("ITEM", colItem.x, y + 1);
      doc.text("QTY", colQty.x, y + 1, { align: "center" });
      doc.text("UNIT PRICE", colPrice.x, y + 1, { align: "right" });
      doc.text("TOTAL", colTotal.x, y + 1, { align: "right" });
      y += 9;

      // Table rows
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      for (let i = 0; i < order.items.length; i++) {
        const item = order.items[i];
        const lines = doc.splitTextToSize(item.name || "", colItem.w);
        doc.setTextColor(26, 26, 26);
        doc.text(lines[0], colItem.x, y);
        doc.setTextColor(102, 102, 102);
        doc.text(String(item.quantity), colQty.x, y, { align: "center" });
        doc.text(fmt(item.price), colPrice.x, y, { align: "right" });
        doc.setFont("helvetica", "bold");
        doc.setTextColor(26, 26, 26);
        doc.text(fmt(item.price * item.quantity), colTotal.x, y, { align: "right" });
        doc.setFont("helvetica", "normal");
        y += 6;
        if (i < order.items.length - 1) {
          doc.setDrawColor(230, 230, 230);
          doc.setLineWidth(0.3);
          doc.line(15, y - 2, pw - 15, y - 2);
        }
      }

      // Total line
      y += 3;
      doc.setDrawColor(201, 168, 76);
      doc.setLineWidth(0.7);
      doc.line(15, y, pw - 15, y);
      y += 7;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(26, 26, 26);
      doc.text("Total Paid:", colItem.x, y);
      doc.setTextColor(201, 168, 76);
      doc.text(fmt(order.total), colTotal.x, y, { align: "right" });
      y += 10;

      // ── Payment Details ──
      saffronLine(y);
      y += 5;
      sectionTitle("PAYMENT DETAILS");
      kv("Reference:", order.paymentRef || "—", { mono: true });
      kv("Amount:", fmt(order.total));
      kv("Currency:", paymentData?.currency || "USD");
      kv("Channel:", channel);
      kv("Card:", cardInfo);
      kv("Bank:", bank);
      if (paymentData?.id) kv("Transaction ID:", `#${paymentData.id}`);
      if (paymentData?.paid_at) kv("Paid At:", paymentData.paid_at ? new Date(paymentData.paid_at).toLocaleString("en-US") : "—");
      if (paymentData?.fees != null) kv("Transaction Fee:", fmt(paymentData.fees / 100));

      // ── Footer ──
      y = Math.max(y + 10, 270);
      saffronLine(y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(102, 102, 102);
      doc.text("This is a computer-generated receipt. No signature required.", pw / 2, y, { align: "center" });
      y += 4;
      doc.text("Thank you for choosing Sabi Spice!", pw / 2, y, { align: "center" });

      doc.save(`receipt-${order.orderNumber}.pdf`);

      fetch("/api/cart/clear", { method: "POST" }).catch(() => {});
    } catch (err: any) {
      toast.error(err.message || "Failed to download receipt");
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 text-sm text-saffron hover:text-white border border-saffron/40 hover:bg-saffron/10 px-5 py-2 transition-colors disabled:opacity-50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {loading ? "Generating PDF..." : "Download Receipt"}
    </button>
  );
}
