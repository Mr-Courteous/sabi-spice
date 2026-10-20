export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { catEmoji } from "@/lib/ui";
import QuickAdd from "@/components/shop/QuickAdd";

const TICKER = ["Puff-puff", "Spring rolls", "Suya pepper", "Efirin", "Faaji box", "Iru", "Zobo", "Mosa", "Spicy chicken"];
const TILES = ["bg-saffron-lighter", "bg-white", "bg-saffron-muted", "bg-white", "bg-saffron-lighter"];

export default async function HomePage() {
  const [products, categories, reviews] = await Promise.all([
    prisma.product.findMany({ where: { published: true }, orderBy: [{ featured: "desc" }, { createdAt: "desc" }], take: 7 }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.testimonial.findMany({ where: { approved: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);
  const ticker = [...TICKER, ...TICKER];

  return (
    <div className="overflow-x-hidden">
      {/* HERO: headline + a "menu ticket" */}
      <section className="max-w-6xl mx-auto px-3 min-[360px]:px-4 sm:px-6 lg:px-8 pt-8 pb-14 grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
        <div className="animate-fadeInUp">
          <p className="inline-block bg-saffron-light text-sabi-black border-2 border-sabi-black rounded-full px-3.5 py-1 text-[11px] sm:text-xs font-bold tracking-wide mb-5 sm:mb-6 -rotate-2 shadow-[2px_2px_0_0_#101840]">🇳🇬 African food, made in the USA</p>
          <h1 className="font-serif font-extrabold text-4xl min-[420px]:text-5xl sm:text-6xl lg:text-7xl leading-[0.98] text-sabi-black">
            Small chops.<br />
            <span className="relative inline-block">Big flavour.<span className="absolute left-0 right-0 bottom-1.5 h-3.5 bg-saffron-light/80 -z-10 -rotate-1 rounded-sm" /></span>
          </h1>
          <p className="text-sabi-grey text-base sm:text-lg leading-relaxed mt-5 sm:mt-6 max-w-lg">Party trays, Faaji boxes and pantry spices, cooked fresh with the flavours you grew up on. Pick up, get it delivered, or let us cater the whole thing.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/products" className="btn-saffron">See the menu</Link>
            <Link href="/catering" className="btn-outline">Cater my event</Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm rotate-2">
          <div className="bg-white border-2 border-sabi-black rounded-3xl shadow-[5px_5px_0_0_#101840] sm:shadow-[8px_8px_0_0_#101840] p-4 sm:p-6">
            <div className="flex items-center gap-3 border-b-2 border-dashed border-sabi-black/20 pb-4 mb-4">
              <Image src="/sabi-logo.png" alt="Sabi Spice" width={48} height={48} className="rounded-full border-2 border-sabi-black shadow-sm" />
              <div><p className="font-serif font-extrabold text-lg leading-none text-sabi-black">Today&apos;s menu</p><p className="text-xs text-sabi-grey">Fresh from the Sabi kitchen</p></div>
            </div>
            <ul className="space-y-2.5">
              {(products.length ? products.slice(0, 4) : [{ id: "a", name: "Faaji Box", price: 50 }, { id: "b", name: "Spicey Suya Pepper", price: 5.99 }, { id: "c", name: "Dry Efirin Leaf", price: 5.99 }]).map((p: any) => (
                <li key={p.id} className="flex items-baseline gap-2 text-sm font-semibold text-sabi-black"><span>{p.name}</span><span className="flex-1 border-b-2 border-dotted border-sabi-black/20" /><span className="font-bold text-sabi-leaf">{formatPrice(p.price)}</span></li>
              ))}
            </ul>
            <p className="mt-5 text-center text-xs font-extrabold tracking-widest text-saffron-dark">★ MADE FRESH ★ ORDER ONLINE ★</p>
          </div>
          <span className="absolute -top-4 -right-1 sm:-top-5 sm:-right-4 bg-saffron text-white font-extrabold text-xs sm:text-sm rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-center leading-tight border-2 border-sabi-black rotate-12 shadow-[3px_3px_0_0_#101840] ring-2 ring-saffron-light/40">Free<br />pickup</span>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-gradient-to-r from-saffron via-saffron-dark to-saffron text-white border-y-2 border-sabi-black py-3.5 overflow-hidden shadow-inner">
        <div className="flex w-max animate-marquee font-serif font-extrabold text-xl tracking-wide">
          {ticker.map((t, i) => <span key={i} className="px-6 whitespace-nowrap flex items-center gap-3">{t} <span className="text-saffron-light drop-shadow-sm">✦</span></span>)}
        </div>
      </div>

      {/* CRAVING: category tiles */}
      {categories.length > 0 && (
        <section className="section-padding">
          <div className="container-max">
            <h2 className="font-serif font-extrabold text-3xl lg:text-4xl mb-8 text-sabi-black">What are you craving?</h2>
            <div className="grid grid-cols-1 min-[340px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {categories.map((c: any, i: number) => (
                <Link key={c.id} href={`/products?category=${c.slug}`} className={`${TILES[i % TILES.length]} card-product p-4 sm:p-5 flex flex-col justify-between min-h-28 sm:min-h-36 group`} style={{ rotate: i % 2 ? "1deg" : "-1deg" }}>
                  <span className="text-4xl group-hover:scale-110 transition-transform">{catEmoji(c.slug)}</span>
                  <span className="font-serif font-bold text-lg leading-tight mt-4 text-sabi-black group-hover:text-saffron-dark transition-colors">{c.name} →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MENU BOARD */}
      {products.length > 0 && (
        <section className="px-3 min-[360px]:px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-6xl mx-auto bg-gradient-to-br from-sabi-leaf via-sabi-charcoal to-sabi-black text-white border-2 border-sabi-black rounded-3xl shadow-[5px_5px_0_0_#101840] sm:shadow-[8px_8px_0_0_#101840] p-4 sm:p-10 relative overflow-hidden">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-saffron-light text-xs font-bold tracking-[0.3em] uppercase block mb-1">Our Specialties</span>
                <h2 className="font-serif font-extrabold text-3xl lg:text-4xl text-white">On the menu</h2>
              </div>
              <Link href="/products" className="text-saffron-light hover:text-white text-sm font-bold transition-colors">Full menu →</Link>
            </div>
            <ul className="grid md:grid-cols-2 md:gap-x-12">
              {products.map((p: any) => (
                <li key={p.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3.5 border-b border-dashed border-white/20">
                  <div className="min-w-0 basis-full min-[380px]:basis-auto">
                    <Link href={`/products/${p.slug}`} className="font-serif font-bold text-lg hover:text-saffron-light transition-colors">{p.name}</Link>
                    <p className="text-xs text-white/70 line-clamp-1">{p.description}</p>
                  </div>
                  <span className="hidden min-[380px]:block flex-1 border-b-2 border-dotted border-white/25 self-end mb-2 min-w-4" />
                  <span className="font-serif font-bold text-saffron-light mr-auto min-[380px]:mr-0">{formatPrice(p.price)}</span>
                  <QuickAdd productId={p.id} inStock={p.stock > 0} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CATERING BANNER */}
      <section className="px-3 min-[360px]:px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-saffron-muted via-saffron-lighter to-white border-2 border-sabi-black rounded-3xl shadow-[5px_5px_0_0_#101840] sm:shadow-[8px_8px_0_0_#101840] p-5 sm:p-12 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="font-script text-saffron-dark text-4xl lg:text-5xl leading-none mb-2">Feeding a crowd?</p>
            <h2 className="font-serif font-extrabold text-4xl lg:text-5xl leading-tight text-sabi-black">Leave the party food to us.</h2>
            <p className="mt-4 text-sabi-black/80 max-w-md text-base leading-relaxed">Birthdays, weddings, offices, naming ceremonies. Tell us the date and headcount, and we&apos;ll send a quote.</p>
            <Link href="/catering" className="btn-dark mt-6">Get a quote</Link>
          </div>
          <ol className="grid sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {["Tell us about your event", "We send a quote + menu ideas", "We cook it fresh for you"].map((s, i) => (
              <li key={s} className="bg-white border-2 border-sabi-black rounded-2xl px-5 py-3.5 flex items-center gap-4 font-bold text-sm shadow-[2px_2px_0_0_#101840]"><span className="font-serif text-3xl font-extrabold text-saffron">{i + 1}</span><span className="text-sabi-black">{s}</span></li>
            ))}
          </ol>
        </div>
      </section>

      {/* REVIEWS as speech bubbles */}
      {reviews.length > 0 && (
        <section className="section-padding pt-0">
          <div className="container-max">
            <h2 className="font-serif font-extrabold text-3xl lg:text-4xl mb-8 text-sabi-black">People are talking</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((t: any) => (
                <figure key={t.id}>
                  <blockquote className="bg-white border-2 border-sabi-black rounded-2xl rounded-bl-none p-6 text-sm leading-relaxed shadow-[4px_4px_0_0_#101840]">
                    <p className="text-saffron mb-2 text-base">{"★".repeat(t.rating)}</p>
                    <p className="text-sabi-black">“{t.content}”</p>
                  </blockquote>
                  <figcaption className="mt-3 ml-2 font-bold text-sm text-sabi-black">— {t.authorName}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
