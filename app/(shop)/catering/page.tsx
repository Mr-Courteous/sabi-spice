import type { Metadata } from "next";
import CateringForm from "@/components/shop/CateringForm";

export const metadata: Metadata = {
  title: "Catering & Events",
  description: "Small chops, Faaji boxes and African party food for birthdays, weddings, offices and more. Request a quote from Sabi Spice.",
};

const PACKAGES = [
  { name: "Faaji Box", tag: "Individual & small groups", desc: "Spring roll, puff-puff, spicy chicken and mosa in one box. Great for gifts, office lunches and casual get-togethers." },
  { name: "Small Chops Tray", tag: "Parties & gatherings", desc: "Party trays of the small chops everyone reaches for first, sized to your guest list." },
  { name: "Full Spread", tag: "Weddings & big events", desc: "Small chops plus hearty African mains, planned with you around your menu, crowd and venue." },
];

export default function CateringPage({ searchParams }: { searchParams: { package?: string } }) {
  return (
    <div>
      <section className="relative bg-gradient-to-br from-sabi-leaf via-sabi-charcoal to-sabi-black py-24 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1 saffron-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8 relative">
          <p className="text-saffron-light text-xs tracking-[0.4em] uppercase mb-5 font-bold">Events &amp; Catering</p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white leading-tight max-w-2xl mb-5">
            Your party, <span className="font-script text-saffron-light text-6xl lg:text-7xl drop-shadow-sm">our kitchen.</span>
          </h1>
          <p className="text-white/80 text-lg max-w-xl leading-relaxed">Tell us about your event and we'll send you a quote. Birthdays, weddings, offices, naming ceremonies — we've got the food.</p>
        </div>
      </section>

      <section className="section-padding bg-sabi-light">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {PACKAGES.map((p) => (
              <div key={p.name} className="card-product p-7 flex flex-col justify-between">
                <div>
                  <p className="text-xs tracking-widest uppercase text-saffron-dark font-extrabold mb-2">{p.tag}</p>
                  <h3 className="font-serif text-2xl text-sabi-black mb-3">{p.name}</h3>
                  <p className="text-sabi-grey text-sm leading-relaxed mb-5">{p.desc}</p>
                </div>
                <a href={`/catering?package=${encodeURIComponent(p.name)}#quote`} className="text-saffron-dark font-bold text-sm hover:underline">Ask about this →</a>
              </div>
            ))}
          </div>

          <div id="quote" className="grid grid-cols-1 lg:grid-cols-3 gap-10 scroll-mt-32">
            <div className="lg:col-span-2"><CateringForm defaultPackage={searchParams.package} /></div>
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-sabi-leaf to-sabi-charcoal border-2 border-sabi-black rounded-2xl p-7 shadow-[4px_4px_0_0_#101840] text-white">
                <h3 className="font-serif text-xl text-white mb-5 font-bold">How it works</h3>
                <ol className="space-y-4 text-sm text-white/85">
                  {["Send us your event details.", "We reply with a quote and menu ideas.", "Confirm your order and we cook it fresh.", "Pick up or have it delivered."].map((s, i) => (
                    <li key={s} className="flex gap-3"><span className="font-script text-saffron-light text-2xl leading-none font-bold">{i + 1}</span><span>{s}</span></li>
                  ))}
                </ol>
              </div>
              <div className="bg-white border-2 border-sabi-black rounded-2xl p-7 shadow-[4px_4px_0_0_#101840]">
                <h3 className="font-semibold text-sabi-black mb-2">Just want a box?</h3>
                <p className="text-sabi-grey text-sm mb-4">Faaji boxes and spices can be ordered straight from the shop.</p>
                <a href="/products" className="text-saffron-dark font-bold text-sm hover:underline">Shop now →</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
