import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Sabi Spice <orders@sabispice.com>";

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(amount);
}

// ── Order confirmation email ──────────────────────────────────────────────
export async function sendOrderConfirmationEmail(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  shippingAddress: string;
  city: string;
  state: string;
  paymentRef: string | null;
  items: { name: string; quantity: number; price: number; image?: string | null }[];
}) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
          <span style="font-family:Georgia,serif;color:#14260A;">${item.name}</span><br/>
          <span style="font-size:12px;color:#5F6B55;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;color:#14260A;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FBF7EE;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7EE;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Gold top bar -->
        <tr><td height="4" style="background:linear-gradient(90deg,#8F6A22,#D9AE56,#B8892F,#D9AE56,#8F6A22);"></td></tr>

        <!-- Header -->
        <tr>
          <td style="background:#14260A;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#fff;letter-spacing:4px;">SABI SPICE</p>
            <p style="margin:6px 0 0;font-size:11px;letter-spacing:6px;color:#B8892F;text-transform:uppercase;">African Food &amp; Spices</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px;">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#B8892F;">Order Confirmed</p>
            <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:30px;color:#14260A;">Thank you, ${order.customerName.split(" ")[0]}!</h1>
            <p style="color:#5F6B55;line-height:1.6;margin:0 0 24px;">Your order has been received and payment confirmed. We'll begin preparing your order right away.</p>

            <!-- Order number box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7EE;border-left:3px solid #B8892F;margin-bottom:32px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#5F6B55;">Order Number</p>
                  <p style="margin:4px 0 0;font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#14260A;">${order.orderNumber}</p>
                </td>
                <td style="padding:16px 20px;text-align:right;">
                  <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#5F6B55;">Payment Ref</p>
                  <p style="margin:4px 0 0;font-family:monospace;font-size:12px;color:#5F6B55;">${order.paymentRef || "—"}</p>
                </td>
              </tr>
            </table>

            <!-- Items -->
            <p style="margin:0 0 12px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#5F6B55;">Items Ordered</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              ${itemsHtml}
              <tr>
                <td style="padding:16px 0 0;font-family:Georgia,serif;font-size:18px;font-weight:bold;color:#14260A;">Total Paid</td>
                <td style="padding:16px 0 0;text-align:right;font-family:Georgia,serif;font-size:18px;font-weight:bold;color:#B8892F;">${formatPrice(order.total)}</td>
              </tr>
            </table>

            <!-- Delivery info -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7EE;margin-bottom:32px;">
              <tr>
                <td style="padding:20px;">
                  <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#5F6B55;">Delivery Address</p>
                  <p style="margin:0;color:#14260A;line-height:1.6;">${order.shippingAddress}<br/>${[order.city, order.state].filter(Boolean).join(", ")}</p>
                </td>
              </tr>
            </table>

            <!-- What happens next -->
            <p style="margin:0 0 16px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#5F6B55;">What Happens Next</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${[
                ["1", "Order Processing", "We'll prepare your order fresh and let you know when it's ready."],
                ["2", "Dispatch", "Your order will be handed to our courier and you'll receive a tracking number."],
                ["3", "Delivery", "We'll email you as soon as your order is ready for pickup or on its way."],
              ].map(([n, title, desc]) => `
              <tr>
                <td width="36" valign="top" style="padding:0 12px 16px 0;">
                  <div style="width:28px;height:28px;background:#B8892F;display:inline-flex;align-items:center;justify-content:center;font-weight:bold;color:#14260A;font-size:13px;text-align:center;line-height:28px;">${n}</div>
                </td>
                <td valign="top" style="padding:0 0 16px;">
                  <p style="margin:0 0 2px;font-weight:600;color:#14260A;font-size:14px;">${title}</p>
                  <p style="margin:0;color:#5F6B55;font-size:13px;line-height:1.5;">${desc}</p>
                </td>
              </tr>`).join("")}
            </table>

            <p style="margin:32px 0 0;color:#5F6B55;font-size:13px;line-height:1.6;">
              Questions? Reply to this email or reach us on WhatsApp. We're always happy to help.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#14260A;padding:24px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#5F6B55;letter-spacing:2px;">© ${new Date().getFullYear()} SABI SPICE · Made with ✦ in the USA</p>
          </td>
        </tr>
        <tr><td height="4" style="background:linear-gradient(90deg,#8F6A22,#D9AE56,#B8892F,#D9AE56,#8F6A22);"></td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: FROM,
      to: order.customerEmail,
      subject: `Order Confirmed – ${order.orderNumber} | Sabi Spice`,
      html,
    });
    console.log(`✅ Order confirmation email sent to ${order.customerEmail}`);
  } catch (err) {
    // Non-fatal — log but don't crash the payment flow
    console.error("Failed to send order confirmation email:", err);
  }
}

// ── Order status update email ─────────────────────────────────────────────
const STATUS_COPY: Record<string, { subject: string; heading: string; body: string }> = {
  PENDING: {
    subject: "Order Received",
    heading: "Your order is on file",
    body: "We've received your order and it's awaiting payment confirmation.",
  },
  PAID: {
    subject: "Payment Confirmed",
    heading: "Payment received",
    body: "We've confirmed your payment. Your order will move into processing shortly.",
  },
  PROCESSING: {
    subject: "Order Processing",
    heading: "We're preparing your order",
    body: "Your order is being prepared. We'll let you know as soon as it's ready or on its way.",
  },
  SHIPPED: {
    subject: "Order Shipped",
    heading: "Your order is on its way",
    body: "Your order has been handed to our courier and is en route to your delivery address.",
  },
  DELIVERED: {
    subject: "Order Delivered",
    heading: "Your order has arrived",
    body: "Your order has been marked as delivered. We hope you love it — thank you for shopping with us!",
  },
  CANCELLED: {
    subject: "Order Cancelled",
    heading: "Your order was cancelled",
    body: "Your order has been cancelled. If this wasn't expected, please reach out and we'll sort it out.",
  },
};

export async function sendOrderStatusUpdateEmail(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
}) {
  const copy = STATUS_COPY[order.status] || {
    subject: "Order Update",
    heading: "Your order status has changed",
    body: `Your order status is now: ${order.status}.`,
  };

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FBF7EE;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7EE;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td height="4" style="background:linear-gradient(90deg,#8F6A22,#D9AE56,#B8892F,#D9AE56,#8F6A22);"></td></tr>
        <tr>
          <td style="background:#14260A;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#fff;letter-spacing:4px;">SABI SPICE</p>
            <p style="margin:6px 0 0;font-size:11px;letter-spacing:6px;color:#B8892F;text-transform:uppercase;">African Food &amp; Spices</p>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:40px;">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#B8892F;">${copy.subject}</p>
            <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:28px;color:#14260A;">${copy.heading}, ${order.customerName.split(" ")[0]}</h1>
            <p style="color:#5F6B55;line-height:1.6;margin:0 0 24px;">${copy.body}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7EE;border-left:3px solid #B8892F;margin-bottom:8px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#5F6B55;">Order Number</p>
                  <p style="margin:4px 0 0;font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#14260A;">${order.orderNumber}</p>
                </td>
                <td style="padding:16px 20px;text-align:right;">
                  <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#5F6B55;">Status</p>
                  <p style="margin:4px 0 0;font-family:Georgia,serif;font-size:18px;font-weight:bold;color:#B8892F;">${order.status}</p>
                </td>
              </tr>
            </table>
            <p style="margin:32px 0 0;color:#5F6B55;font-size:13px;line-height:1.6;">
              Questions about your order? Reply to this email or reach us on WhatsApp — we're happy to help.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#14260A;padding:24px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#5F6B55;letter-spacing:2px;">© ${new Date().getFullYear()} SABI SPICE · Made with ✦ in the USA</p>
          </td>
        </tr>
        <tr><td height="4" style="background:linear-gradient(90deg,#8F6A22,#D9AE56,#B8892F,#D9AE56,#8F6A22);"></td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: FROM,
      to: order.customerEmail,
      subject: `${copy.subject} – ${order.orderNumber} | Sabi Spice`,
      html,
    });
    console.log(`✅ Order status (${order.status}) email sent to ${order.customerEmail}`);
  } catch (err) {
    // Non-fatal — log but don't block the status update itself
    console.error("Failed to send order status update email:", err);
  }
}

// ── Contact form notification email ───────────────────────────────────────
export async function sendContactNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@sabispice.com";
  const html = `
<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;">
  <div style="background:#14260A;padding:20px;text-align:center;">
    <p style="margin:0;color:#B8892F;font-size:18px;font-weight:bold;letter-spacing:3px;">SABI SPICE</p>
    <p style="margin:4px 0 0;color:#5F6B55;font-size:11px;letter-spacing:2px;">NEW CONTACT MESSAGE</p>
  </div>
  <div style="background:#fff;padding:28px;border:1px solid #f0f0f0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      ${[
        ["From", data.name],
        ["Email", data.email],
        ["Phone", data.phone || "—"],
        ["Subject", data.subject || "—"],
      ].map(([l, v]) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f8f8f8;width:90px;color:#5F6B55;font-size:12px;text-transform:uppercase;letter-spacing:1px;">${l}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f8f8f8;color:#14260A;font-size:14px;">${v}</td>
      </tr>`).join("")}
    </table>
    <div style="margin-top:20px;padding:16px;background:#FBF7EE;border-left:3px solid #B8892F;">
      <p style="margin:0;color:#14260A;line-height:1.6;font-size:14px;">${data.message}</p>
    </div>
    <p style="margin:16px 0 0;font-size:12px;color:#5F6B55;">Reply directly to this email to respond to ${data.name}.</p>
  </div>
</div>`;

  try {
    await resend.emails.send({
      from: FROM,
      to: adminEmail,
      replyTo: data.email,
      subject: `New Contact: ${data.subject || data.name} | Sabi Spice`,
      html,
    });
  } catch (err) {
    console.error("Failed to send contact notification:", err);
  }
}

// ── Catering request emails (owner alert + customer copy) ─────────────────
const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export async function sendCateringEmails(r: {
  name: string; email: string; phone: string; eventType: string; eventDate: Date; guests: number;
  location: string; budget: string | null; message: string | null;
}) {
  const date = new Date(r.eventDate).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const rows = [["Name", r.name], ["Email", r.email], ["Phone", r.phone], ["Event", r.eventType], ["Date", date], ["Guests", String(r.guests)], ["Location", r.location], ["Budget", r.budget || "—"]]
    .map(([l, v]) => `<tr><td style="padding:8px 0;border-bottom:1px solid #f3efe6;width:90px;color:#5F6B55;font-size:12px;text-transform:uppercase;letter-spacing:1px;">${l}</td><td style="padding:8px 0;border-bottom:1px solid #f3efe6;color:#14260A;font-size:14px;">${esc(v)}</td></tr>`).join("");
  const wrap = (title: string, intro: string) => `
<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;">
  <div style="background:#284912;padding:20px;text-align:center;"><p style="margin:0;color:#D9AE56;font-size:20px;font-weight:bold;letter-spacing:3px;">SABI SPICE</p><p style="margin:4px 0 0;color:#ffffffb3;font-size:11px;letter-spacing:2px;">${title}</p></div>
  <div style="background:#fff;padding:28px;border:1px solid #f3efe6;">
    <p style="margin:0 0 16px;color:#14260A;line-height:1.6;">${intro}</p>
    <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
    ${r.message ? `<div style="margin-top:20px;padding:16px;background:#FBF7EE;border-left:3px solid #B8892F;"><p style="margin:0;color:#14260A;line-height:1.6;font-size:14px;white-space:pre-wrap;">${esc(r.message)}</p></div>` : ""}
  </div>
</div>`;
  const adminEmail = process.env.ADMIN_EMAIL || "admin@sabispice.com";
  await Promise.all([
    resend.emails.send({ from: FROM, to: adminEmail, replyTo: r.email, subject: `New catering request: ${r.eventType}, ${r.guests} guests | Sabi Spice`, html: wrap("NEW CATERING REQUEST", `Reply to this email to respond to ${esc(r.name)}.`) }),
    resend.emails.send({ from: FROM, to: r.email, subject: "We got your catering request | Sabi Spice", html: wrap("REQUEST RECEIVED", `Hi ${esc(r.name.split(" ")[0])}, thank you for thinking of Sabi Spice! Here's what you sent us. We'll be in touch with a quote soon.`) }),
  ]);
}
