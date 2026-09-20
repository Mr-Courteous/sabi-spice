export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import FaqAccordion from "@/components/shop/FaqAccordion";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Sabi Spice food, orders, delivery and catering.",
};

const faqs = [
  {
    category: "Orders & Delivery",
    items: [
      { q: "How do I get my order?", a: "At checkout choose pickup (free), local delivery, or nationwide shipping. Shipping is for dry spices and leaves only; fresh food is pickup or local delivery." },
      { q: "How much is delivery?", a: "Local delivery and shipping fees are shown at checkout before you pay. Orders over the free-delivery amount ship or deliver free." },
      { q: "Can I change or cancel my order?", a: "Contact us as soon as possible. Because food is made fresh to order, we can only change or cancel before cooking begins." },
    ],
  },
  {
    category: "Food & Spices",
    items: [
      { q: "What do you make?", a: "African dishes and small chops such as spring rolls, puff-puff, spicy chicken and mosa, plus pantry spices and leaves like efirin, bitter leaf, suya pepper, iru and cloves." },
      { q: "How should I store the spices?", a: "Keep dried leaves, peppers and seeds in a cool, dry place in an airtight container, away from direct sunlight." },
      { q: "I have a food allergy. Can you help?", a: "Please tell us about any allergies in your order notes or catering request before ordering. Our kitchen handles common allergens, so we can't promise allergen-free food." },
    ],
  },
  {
    category: "Catering & Events",
    items: [
      { q: "How do I book catering?", a: "Send a request on our Catering page with your date, guest count and location. We'll reply with a quote and menu suggestions." },
      { q: "How far ahead should I book?", a: "As early as you can. Include your event date in the request and we'll confirm whether we're available." },
      { q: "Do you deliver to the venue?", a: "Yes, delivery can be arranged for events. Tell us the location in your request and we'll include it in your quote." },
    ],
  },
  {
    category: "Payments & Refunds",
    items: [
      { q: "What payment methods do you accept?", a: "All major credit and debit cards through Stripe. Payment is taken securely at checkout and we never see your card details." },
      { q: "What if something is wrong with my order?", a: "Contact us right away with your order number and, if you can, a photo. We'll make it right." },
    ],
  },
];

export default function FaqPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-sabi-black py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 saffron-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-saffron text-xs tracking-[0.4em] uppercase mb-4">Help Centre</p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white">Frequently Asked<br />Questions</h1>
          <p className="text-gray-400 mt-5 text-lg max-w-lg mx-auto">Everything you need to know about our food, orders, and catering.</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding bg-sabi-light">
        <div className="container-max px-4 sm:px-6 lg:px-8 max-w-4xl">
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* Still have questions */}
      <section className="section-padding bg-white">
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-saffron/30 mb-6">
            <span className="text-saffron text-2xl">?</span>
          </div>
          <h2 className="font-serif text-3xl text-sabi-black mb-4">Still Have Questions?</h2>
          <p className="text-sabi-grey max-w-md mx-auto mb-8">Our team is happy to help. Reach out via the contact form or WhatsApp and we'll respond promptly.</p>
          <Link href="/contact" className="btn-saffron">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
