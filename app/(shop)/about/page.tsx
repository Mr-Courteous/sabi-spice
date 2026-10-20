import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind Sabi Spice: African dishes, small chops and spices, made with care in the US.",
};

const values = [
  { icon: "✦", title: "Authentic flavour", desc: "Recipes and ingredients rooted in the African kitchen, cooked the way they should taste." },
  { icon: "◈", title: "Made fresh", desc: "Food is prepared to order, and spices are packed clean, fresh and ready to cook." },
  { icon: "❖", title: "Made for sharing", desc: "From a single box to a full party spread, our food is meant to bring people together." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative bg-gradient-to-br from-sabi-leaf via-sabi-charcoal to-sabi-black py-28 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1 saffron-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8 relative">
          <p className="text-saffron-light text-xs tracking-[0.4em] uppercase mb-5 font-bold">Our Story</p>
          <h1 className="font-serif text-5xl lg:text-7xl text-white leading-tight max-w-2xl">
            "Sabi" means <span className="font-script text-saffron-light text-6xl lg:text-8xl drop-shadow-sm">to know.</span>
          </h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-5 text-sabi-grey leading-relaxed">
            <p className="text-xs tracking-[0.3em] uppercase text-saffron-dark font-extrabold">Who we are</p>
            <p className="text-base text-sabi-black">Sabi Spice cooks African dishes and small chops in the US, and sells the spices and leaves that make them taste like home: efirin, bitter leaf, suya pepper, iru, cloves and more.</p>
            <p>We started with a simple idea: people far from home should be able to find the flavours they grew up on, and share them with the people around them, whether that is a quick Faaji box or a whole party.</p>
            <p>Whether you're stocking your pantry or feeding a crowd, we want every bite to feel familiar.</p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/products" className="btn-saffron">Shop Now</Link>
              <Link href="/catering" className="btn-dark">Cater My Event</Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-saffron-muted via-saffron-lighter to-white border-2 border-sabi-black rounded-3xl aspect-square flex items-center justify-center shadow-[6px_6px_0_0_#101840] p-8">
            <Image src="/sabi-logo.png" alt="Sabi Spice" width={300} height={300} className="rounded-2xl drop-shadow-md" />
          </div>
        </div>
      </section>

      <section className="section-padding bg-sabi-light">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-saffron-dark text-xs tracking-[0.3em] uppercase mb-3 font-extrabold">What we stand for</p>
            <h2 className="font-serif text-4xl text-sabi-black font-extrabold">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white border-2 border-sabi-black rounded-2xl p-8 shadow-[4px_4px_0_0_#101840]">
                <span className="text-saffron text-2xl font-serif font-bold">{v.icon}</span>
                <h3 className="font-serif text-xl text-sabi-black font-bold mt-4 mb-2">{v.title}</h3>
                <p className="text-sabi-grey text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-saffron">
        <div className="container-max text-center">
          <h2 className="font-serif text-3xl text-white mb-3">Hungry yet?</h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">Order a box, stock up on spices, or tell us about your next event.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products" className="btn-dark">Shop Now</Link>
            <Link href="/catering" className="btn-outline !text-white !border-white hover:!bg-white hover:!text-saffron-dark">Request Catering</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
