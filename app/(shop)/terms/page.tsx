import type { Metadata } from "next";
export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div>
      <section className="bg-sabi-dark py-20 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 saffron-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-5xl text-white">Terms of Service</h1>
          <p className="text-sabi-grey mt-3">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        </div>
      </section>
      <section className="section-padding bg-surface">
        <div className="container-max px-4 sm:px-6 lg:px-8 max-w-3xl prose prose-lg">
          <h2>1. Orders & Payment</h2>
          <p>All orders are subject to availability. Payment must be completed in full before orders are processed. Prices are listed in US dollars (USD).</p>
          <h2>2. Shipping & Delivery</h2>
          <p>Delivery times are estimates and not guaranteed. Sabi Spice is not responsible for delays caused by courier partners or circumstances beyond our control.</p>
          <h2>3. Returns & Refunds</h2>
          <p>We accept returns within 7 days of delivery for unused items in original condition. Custom orders are non-refundable. Refunds are processed within 5–7 business days to the original payment method.</p>
          <h2>4. Intellectual Property</h2>
          <p>All content, designs, logos, and imagery on this site are the property of Sabi Spice and may not be reproduced without written permission.</p>
          <h2>5. Catering &amp; Events</h2>
          <p>A catering request is a quote enquiry, not a booking, until Sabi Spice confirms it in writing. Deposit and cancellation terms are agreed in your quote. Fresh food cannot be returned; if there is a problem with your order, contact us right away.</p>
          <h2>6. Contact</h2>
          <p>For any questions regarding these terms, contact us at <a href="mailto:hello@sabispice.com" className="text-saffron">hello@sabispice.com</a>.</p>
        </div>
      </section>
    </div>
  );
}
