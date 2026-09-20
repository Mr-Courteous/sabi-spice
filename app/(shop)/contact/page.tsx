export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import ContactForm from "@/components/shop/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Sabi Spice — we'd love to hear from you.",
};

const PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || "(555) 000-0000";

const contactDetails = [
  { icon: "📞", label: "Phone / WhatsApp", value: PHONE, href: `tel:${PHONE.replace(/[^+\d]/g, "")}` },
  { icon: "✉️", label: "Email", value: "hello@sabispice.com", href: "mailto:hello@sabispice.com" },
  { icon: "📍", label: "Location", value: "United States — pickup details shared at checkout", href: "#" },
  { icon: "🕐", label: "Business Hours", value: "Mon–Sat: 9am – 6pm", href: null },
];

const socials = [
  { name: "Instagram", handle: "@sabispice", href: "#" },
  { name: "Facebook", handle: "Sabi Spice", href: "#" },
  { name: "WhatsApp", handle: PHONE, href: "#" },
];

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-sabi-black py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 saffron-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-saffron" />
            <p className="text-saffron text-xs tracking-[0.4em] uppercase">Get In Touch</p>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white leading-tight max-w-xl">
            We'd Love to<br />
            <span className="text-transparent bg-clip-text bg-saffron-gradient italic">Hear From You.</span>
          </h1>
        </div>
      </section>

      <section className="section-padding bg-sabi-light">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left – details */}
            <div>
              <p className="text-saffron text-xs tracking-[0.3em] uppercase mb-4">Contact Details</p>
              <h2 className="font-serif text-3xl text-sabi-black mb-8">Let's Talk</h2>

              <div className="space-y-6 mb-10">
                {contactDetails.map((item) => (
                  <div key={item.label} className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-sabi-black flex items-center justify-center flex-shrink-0 text-lg">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs tracking-widest uppercase text-sabi-grey mb-0.5">{item.label}</p>
                      {item.href && item.href !== "#" ? (
                        <a href={item.href} className="font-medium text-sabi-black hover:text-saffron transition-colors">{item.value}</a>
                      ) : (
                        <p className="font-medium text-sabi-black">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-200 mb-8" />

              <p className="text-xs tracking-widest uppercase text-sabi-grey mb-4">Follow Us</p>
              <div className="space-y-3">
                {socials.map((s) => (
                  <a key={s.name} href={s.href} className="flex items-center gap-3 group">
                    <span className="text-xs font-semibold text-sabi-black tracking-widest uppercase w-24 group-hover:text-saffron transition-colors">{s.name}</span>
                    <span className="text-sabi-grey text-sm group-hover:text-saffron transition-colors">{s.handle}</span>
                  </a>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-10 bg-white border border-gray-200 h-48 flex items-center justify-center">
                <p className="text-sabi-grey text-sm">Google Maps Embed — add your address in the admin panel</p>
              </div>
            </div>

            {/* Right – form */}
            <div className="bg-white p-8 lg:p-10 border border-gray-100">
              <h3 className="font-serif text-2xl text-sabi-black mb-2">Send a Message</h3>
              <p className="text-sabi-grey text-sm mb-8">Fill in the form and we'll get back to you within 24 hours.</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
