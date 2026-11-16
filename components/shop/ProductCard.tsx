import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { catEmoji } from "@/lib/ui";
import QuickAdd from "@/components/shop/QuickAdd";

// Poster-style card: the dish fills the frame, the name sits in the shadow at the bottom.
export default function ProductCard({ p }: { p: any }) {
  const sold = p.stock <= 0;
  const off = p.comparePrice && p.comparePrice > p.price ? Math.round((1 - p.price / p.comparePrice) * 100) : 0;
  return (
    <article className="group relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-surface ring-1 ring-sabi-black/10">
      <Link href={`/products/${p.slug}`} className="absolute inset-0" aria-label={p.name}>
        {p.images?.[0]
          ? <Image src={p.images[0]} alt="" fill sizes="(min-width:1024px) 25vw, 70vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          : <span className="absolute inset-0 grid place-items-center text-7xl bg-saffron-muted">{catEmoji(p.category?.slug)}</span>}
        <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
      </Link>
      <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 pointer-events-none">
        {p.featured && <span className="bg-[#FFC21F] text-[#12301E] text-[11px] font-bold px-3 py-1 rounded-full">Popular</span>}
        {off > 0 && <span className="bg-saffron text-[rgb(var(--on-accent))] text-[11px] font-bold px-3 py-1 rounded-full">{off}% off</span>}
        {sold && <span className="bg-black/70 text-white text-[11px] font-semibold px-3 py-1 rounded-full">Sold out</span>}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between gap-3 pointer-events-none">
        <div className="min-w-0">
          <h3 className="font-display text-2xl sm:text-[1.7rem] leading-[1.05] text-[#F6EEE2] line-clamp-2">{p.name}</h3>
          <p className="mt-1.5 text-sm font-semibold text-saffron-light">{formatPrice(p.price)}{off > 0 && <span className="ml-2 text-xs font-normal text-white/50 line-through">{formatPrice(p.comparePrice)}</span>}</p>
        </div>
        <div className="pointer-events-auto"><QuickAdd productId={p.id} inStock={!sold} /></div>
      </div>
    </article>
  );
}
