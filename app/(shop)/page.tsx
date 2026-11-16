export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { catEmoji } from "@/lib/ui";
import { formatPrice } from "@/lib/utils";
import { FULFILLMENT_LABELS, FREE_DELIVERY_OVER } from "@/lib/shipping";
import ProductCard from "@/components/shop/ProductCard";
import Icon from "@/components/ui/Icon";

const WRAP = "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8";

export default async function HomePage() {
  const [products, categories, reviews] = await Promise.all([
    prisma.product.findMany({ where: { published: true }, include: { category: true }, orderBy: [{ featured: "desc" }, { createdAt: "desc" }], take: 8 }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.testimonial.findMany({ where: { approved: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);
  const shots = products.filter((p: any) => p.images[0]);
  const hero: any = shots[0];
  const band: any = shots[1] || shots[0];
  const ways: [keyof typeof FULFILLMENT_LABELS, string][] = [["PICKUP", "store"], ["DELIVERY", "truck"], ["SHIPPING", "box"]];

  return (
    <div className="overflow-x-hidden">
      {/* HERO: full-bleed, slow push-in, melts into the page */}
      <section className="grain relative -mt-16 sm:-mt-[72px] min-h-[92svh] flex items-end overflow-hidden">
        {hero
          ? <Image src={hero.images[0]} alt="" fill priority sizes="100vw" className="object-cover animate-drift" />
          : <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgb(255_194_31/0.45),transparent_55%),radial-gradient(ellipse_at_20%_80%,rgb(var(--accent)/0.18),transparent_50%)]" />}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-sabi-light via-sabi-light/85 sm:via-sabi-light/70 to-sabi-light/5" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-sabi-light to-transparent" />

        <div className={`${WRAP} relative w-full pt-40 pb-14 sm:pb-20`}>
          <h1 className="animate-fadeInUp font-display text-[3.4rem] min-[420px]:text-7xl sm:text-8xl lg:text-[8.5rem] leading-[0.92] tracking-[-0.02em]">
            Small chops.<br /><em className="italic">Big flavour.</em>
          </h1>
          <p className="animate-fadeInUp [animation-delay:150ms] text-sabi-grey text-base sm:text-lg leading-relaxed mt-6 max-w-md">Party trays, Faaji boxes and pantry spices, cooked fresh with the flavours you grew up on.</p>
          <div className="animate-fadeInUp [animation-delay:300ms] flex flex-wrap gap-3 mt-8">
            <Link href="/products" className="btn-saffron">Order now <Icon name="arrow" className="w-4 h-4" /></Link>
            <Link href="/catering" className="btn-outline">Cater my event</Link>
          </div>
          <div className="animate-fadeInUp [animation-delay:450ms] mt-12 pt-5 border-t border-sabi-black/15 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-sm text-sabi-grey">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li className="flex items-center gap-2"><Icon name="store" className="w-[18px] h-[18px] text-saffron" /> Free pickup</li>
              <li className="flex items-center gap-2"><Icon name="truck" className="w-[18px] h-[18px] text-saffron" /> Delivery free over ${FREE_DELIVERY_OVER}</li>
              <li className="flex items-center gap-2"><Icon name="party" className="w-[18px] h-[18px] text-saffron" /> Event catering</li>
            </ul>
            {hero && <Link href={`/products/${hero.slug}`} className="font-medium hover:text-saffron transition-colors">Now serving: <span className="text-sabi-black">{hero.name}</span>, {formatPrice(hero.price)}</Link>}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className={`${WRAP} pt-6`}>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((c: any) => (
              <Link key={c.id} href={`/products?category=${c.slug}`} className="chip chip-off py-2.5"><span aria-hidden>{catEmoji(c.slug)}</span>{c.name}</Link>
            ))}
          </div>
        </section>
      )}

      {/* THE MENU */}
      {products.length > 0 && (
        <section className={`${WRAP} pt-14 sm:pt-20`}>
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="font-display text-4xl sm:text-6xl leading-none">Tonight&apos;s menu</h2>
            <Link href="/products" className="text-sm font-semibold text-saffron hover:text-saffron-dark whitespace-nowrap pb-1">Full menu</Link>
          </div>
          <div className="flex gap-3 sm:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible">
            {products.map((p: any) => <div key={p.id} className="snap-start flex-shrink-0 w-[68%] sm:w-[40%] lg:w-auto"><ProductCard p={p} /></div>)}
          </div>
        </section>
      )}

      {/* HOW YOU GET IT */}
      <section className={`${WRAP} pt-16 sm:pt-24`}>
        <div className="grid sm:grid-cols-3 border-y border-sabi-black/10 divide-y sm:divide-y-0 sm:divide-x divide-sabi-black/10">
          {ways.map(([key, icon]) => (
            <div key={key} className="py-7 sm:px-8 first:sm:pl-0 last:sm:pr-0">
              <Icon name={icon} className="w-7 h-7 text-saffron mb-4" />
              <h3 className="font-display text-3xl leading-none">{FULFILLMENT_LABELS[key].title}</h3>
              <p className="text-sm text-sabi-grey mt-2 leading-relaxed">{FULFILLMENT_LABELS[key].desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATERING: second scene */}
      <section className="relative mt-16 sm:mt-24 overflow-hidden grain">
        {band
          ? <Image src={band.images[0]} alt="" fill sizes="100vw" className="object-cover" />
          : <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgb(var(--accent)/0.3),transparent_60%)]" />}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-sabi-dark via-sabi-dark/85 to-sabi-dark/30" />
        <div className={`${WRAP} relative py-20 sm:py-32 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-end`}>
          <div>
            <p className="font-script text-saffron text-4xl sm:text-5xl leading-none mb-3">Feeding a crowd?</p>
            <h2 className="font-display text-4xl sm:text-6xl leading-[0.98] text-[#F6EEE2]">Leave the party food to us.</h2>
            <p className="mt-5 text-[#F6EEE2]/70 max-w-md leading-relaxed">Birthdays, weddings, offices, naming ceremonies. Tell us the date and headcount, and we&apos;ll send a quote.</p>
            <Link href="/catering" className="btn-saffron mt-8">Get a quote</Link>
          </div>
          <ol className="space-y-4 text-[#F6EEE2]">
            {["Tell us about your event", "We send a quote + menu ideas", "We cook it fresh for you"].map((s, i) => (
              <li key={s} className="flex items-baseline gap-4 border-b border-white/15 pb-4"><span className="font-display text-3xl text-saffron w-6">{i + 1}</span><span className="text-sm font-medium">{s}</span></li>
            ))}
          </ol>
        </div>
      </section>

      {/* REVIEWS */}
      {reviews.length > 0 && (
        <section className={`${WRAP} py-16 sm:py-24`}>
          <h2 className="font-display text-4xl sm:text-6xl leading-none mb-10">People are talking</h2>
          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {reviews.map((t: any) => (
              <figure key={t.id} className="flex flex-col">
                <div className="flex gap-0.5 text-gold mb-4" aria-label={`${t.rating} out of 5 stars`}>{Array.from({ length: t.rating }).map((_, i) => <Icon key={i} name="star" className="w-4 h-4" />)}</div>
                <blockquote className="font-display italic text-2xl leading-snug flex-1">“{t.content}”</blockquote>
                <figcaption className="mt-5 text-sm font-semibold text-sabi-grey">{t.authorName}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
