"use client";
import { useEffect } from "react";

export default function VerifyOnMount({ orderNumber, sessionId, isPending }: { orderNumber: string; sessionId: string; isPending: boolean }) {
  useEffect(() => {
    if (!isPending || !sessionId) return;
    fetch("/api/orders/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, orderNumber }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          fetch("/api/cart/clear", { method: "POST" }).catch(() => {});
          if ((window as any).__refreshCartCount) (window as any).__refreshCartCount();
        }
      })
      .catch(() => {});
  }, [isPending, sessionId, orderNumber]);
  return null;
}
