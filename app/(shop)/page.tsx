export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { catEmoji } from "@/lib/ui";
import QuickAdd from "@/components/shop/QuickAdd";

const TICKER = ["Puff-puff", "Spring rolls", "Suya pepper", "Efirin", "Faaji box", "Iru", "Zobo", "Mosa", "Spicy chicken"];
const TILES = ["bg-saffron-light", "bg-white", "bg-saffron-muted", "bg-white", "bg-saffron-light"];

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
          <p className="inline-block bg-saffron-light border-2 border-sabi-black rounded-full px-3 py-1 text-[11px] sm:text-xs font-bold tracking-wide mb-5 sm:mb-6 -rotate-2">🇳🇬 African food, made in the USA</p>
          <h1 className="font-serif font-extrabold text-4xl min-[420px]:text-5xl sm:text-6xl lg:text-7xl leading-[0.98]">
            Small chops.<br />
            <span className="relative inline-block">Big flavour.<span className="absolute left-0 right-0 bottom-1 h-3 bg-saffron-light -z-10 -rotate-1" /></span>
          </h1>
          <p className="text-sabi-grey text-base sm:text-lg leading-relaxed mt-5 sm:mt-6 max-w-lg">Party trays, Faaji boxes and pantry spices, cooked fresh with the flavours you grew up on. Pick up, get it delivered, or let us cater the whole thing.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/products" className="btn-saffron">See the menu</Link>
            <Link href="/catering" className="btn-outline">Cater my event</Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm rotate-2">
          <div className="bg-white border-2 border-sabi-black rounded-3xl shadow-[5px_5px_0_0_#16321C] sm:shadow-[8px_8px_0_0_#16321C] p-4 sm:p-6">
            <div className="flex items-center gap-3 border-b-2 border-dashed border-sabi-black/30 pb-4 mb-4">
              <Image src="/sabi-logo.png" alt="Sabi Spice" width={48} height={48} className="rounded-full border-2 border-sabi-black" />
              <div><p className="font-serif font-extrabold text-lg leading-none">Today&apos;s menu</p><p className="text-xs text-sabi-grey">Fresh from the Sabi kitchen</p></div>
            </div>
            <ul className="space-y-2.5">
              {(products.length ? products.slice(0, 4) : [{ id: "a", name: "Faaji Box", price: 50 }, { id: "b", name: "Spicey Suya Pepper", price: 5.99 }, { id: "c", name: "Dry Efirin Leaf", price: 5.99 }]).map((p: any) => (
                <li key={p.id} className="flex items-baseline gap-2 text-sm font-semibold"><span>{p.name}</span><span className="flex-1 border-b-2 border-dotted border-sabi-black/30" /><span>{formatPrice(p.price)}</span></li>
              ))}
            </ul>
            <p className="mt-5 text-center text-xs font-bold tracking-widest text-saffron">★ MADE FRESH ★ ORDER ONLINE ★</p>
          </div>
          <span className="absolute -top-4 -right-1 sm:-top-5 sm:-right-4 bg-saffron text-white font-extrabold text-xs sm:text-sm rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-center leading-tight border-2 border-sabi-black rotate-12 shadow-[3px_3px_0_0_#16321C]">Free<br />pickup</span>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-saffron text-white border-y-2 border-sabi-black py-3 overflow-hidden">
        <div className="flex w-max animate-marquee font-serif font-extrabold text-xl">
          {ticker.map((t, i) => <span key={i} className="px-6 whitespace-nowrap">{t} <span className="text-saffron-light">✦</span></span>)}
        </div>
      </div>

      {/* CRAVING: category tiles */}
      {categories.length > 0 && (
        <section className="section-padding">
          <div className="container-max">
            <h2 className="font-serif font-extrabold text-3xl lg:text-4xl mb-8">What are you craving?</h2>
            <div className="grid grid-cols-1 min-[340px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {categories.map((c: any, i: number) => (
                <Link key={c.id} href={`/products?category=${c.slug}`} className={`${TILES[i % TILES.length]} card-product p-4 sm:p-5 flex flex-col justify-between min-h-28 sm:min-h-36`} style={{ rotate: i % 2 ? "1deg" : "-1deg" }}>
                  <span className="text-4xl">{catEmoji(c.slug)}</span>
                  <span className="font-serif font-bold text-lg leading-tight mt-4">{c.name} →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MENU BOARD */}
      {products.length > 0 && (
        <section className="px-3 min-[360px]:px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-6xl mx-auto bg-sabi-leaf text-white border-2 border-sabi-black rounded-3xl shadow-[5px_5px_0_0_#16321C] sm:shadow-[8px_8px_0_0_#16321C] p-4 sm:p-10">
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-serif font-extrabold text-3xl lg:text-4xl">On the menu</h2>
              <Link href="/products" className="text-saffron-light text-sm font-bold hover:underline">Full menu →</Link>
            </div>
            <ul className="grid md:grid-cols-2 md:gap-x-12">
              {products.map((p: any) => (
                <li key={p.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3.5 border-b border-dashed border-white/25">
                  <div className="min-w-0 basis-full min-[380px]:basis-auto">
                    <Link href={`/products/${p.slug}`} className="font-serif font-bold text-lg hover:text-saffron-light">{p.name}</Link>
                    <p className="text-xs text-white/60 line-clamp-1">{p.description}</p>
                  </div>
                  <span className="hidden min-[380px]:block flex-1 border-b-2 border-dotted border-white/30 self-end mb-2 min-w-4" />
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
        <div className="max-w-6xl mx-auto bg-saffron-light border-2 border-sabi-black rounded-3xl shadow-[5px_5px_0_0_#16321C] sm:shadow-[8px_8px_0_0_#16321C] p-5 sm:p-12 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="font-script text-saffron-dark text-4xl leading-none mb-2">Feeding a crowd?</p>
            <h2 className="font-serif font-extrabold text-4xl lg:text-5xl leading-tight">Leave the party food to us.</h2>
            <p className="mt-4 text-sabi-black/80 max-w-md">Birthdays, weddings, offices, naming ceremonies. Tell us the date and headcount, and we&apos;ll send a quote.</p>
            <Link href="/catering" className="btn-dark mt-6">Get a quote</Link>
          </div>
          <ol className="grid sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {["Tell us about your event", "We send a quote + menu ideas", "We cook it fresh for you"].map((s, i) => (
              <li key={s} className="bg-white border-2 border-sabi-black rounded-2xl px-5 py-3 flex items-center gap-4 font-bold text-sm"><span className="font-serif text-3xl text-saffron">{i + 1}</span>{s}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* REVIEWS as speech bubbles */}
      {reviews.length > 0 && (
        <section className="section-padding pt-0">
          <div className="container-max">
            <h2 className="font-serif font-extrabold text-3xl lg:text-4xl mb-8">People are talking</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((t: any) => (
                <figure key={t.id}>
                  <blockquote className="bg-white border-2 border-sabi-black rounded-2xl rounded-bl-none p-6 text-sm leading-relaxed shadow-[4px_4px_0_0_#16321C]">
                    <p className="text-saffron mb-2">{"★".repeat(t.rating)}</p>“{t.content}”
                  </blockquote>
                  <figcaption className="mt-3 ml-2 font-bold text-sm">— {t.authorName}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
