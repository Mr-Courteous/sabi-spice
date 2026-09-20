export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import QuickAdd from "@/components/shop/QuickAdd";
import { catEmoji } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our collection of African food, small chops and spices at Sabi Spice.",
};

async function getProducts(category?: string) {
  return prisma.product.findMany({
    where: {
      published: true,
      ...(category ? { category: { slug: category } } : {}),
    },
    include: { category: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
}

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string };
}) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams.category),
    getCategories(),
  ]);

  const active = searchParams.category;
  const current = categories.find((c: any) => c.slug === active);
  const pill = (on: boolean) => `whitespace-nowrap flex-shrink-0 px-3.5 py-1.5 lg:py-2 rounded-full border-2 border-sabi-black text-sm font-bold transition-colors ${on ? "bg-sabi-black text-white" : "bg-white hover:bg-saffron-muted"}`;

  return (
    <div className="max-w-6xl mx-auto px-3 min-[360px]:px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex flex-wrap items-end justify-between gap-x-3 mb-3 sm:mb-6">
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl">{current ? current.name : "The Menu"}</h1>
        <p className="text-sabi-grey text-sm font-semibold">{products.length} item{products.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[210px_minmax(0,1fr)] gap-4 lg:gap-8">
        {/* Category rail: chips on mobile, sticky list on desktop */}
        <aside className="min-w-0 sticky top-[66px] z-30 -mx-3 min-[360px]:-mx-4 sm:-mx-6 lg:mx-0 lg:top-24 lg:self-start bg-sabi-light/95 backdrop-blur lg:bg-transparent border-b-2 border-sabi-black/10 lg:border-0">
          <div className="flex lg:flex-col gap-2 overflow-x-auto scrollbar-hide px-3 min-[360px]:px-4 sm:px-6 lg:px-0 py-2.5 lg:py-0">
            <Link href="/products" className={pill(!active)}>🍽 Everything</Link>
            {categories.map((c: any) => (
              <Link key={c.slug} href={`/products?category=${c.slug}`} className={pill(active === c.slug)}>{catEmoji(c.slug)} {c.name}</Link>
            ))}
          </div>
        </aside>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-5 content-start min-w-0">
            {products.map((p: any) => (
              <div key={p.id} className="card-product flex gap-3 sm:gap-4 p-2.5 sm:p-3 items-center min-w-0">
                <Link href={`/products/${p.slug}`} className="relative w-20 h-20 min-[340px]:w-24 min-[340px]:h-24 sm:w-28 sm:h-28 flex-shrink-0 self-start rounded-xl overflow-hidden bg-saffron-muted border-2 border-sabi-black flex items-center justify-center">
                  {p.images[0] ? <Image src={p.images[0]} alt={p.name} fill className="object-cover" /> : <span className="text-4xl sm:text-5xl">{catEmoji(p.category?.slug)}</span>}
                  {p.stock === 0 && <span className="absolute inset-0 bg-white/70 flex items-center justify-center text-[11px] font-bold">SOLD OUT</span>}
                </Link>
                <div className="flex-1 min-w-0 pr-1">
                  {p.featured && <span className="inline-block bg-saffron-light border border-sabi-black rounded-full px-2 text-[10px] font-bold mb-1">★ FAVOURITE</span>}
                  <Link href={`/products/${p.slug}`} className="block font-serif font-bold text-base sm:text-lg leading-tight hover:text-saffron break-words">{p.name}</Link>
                  <p className="hidden min-[340px]:block text-xs text-sabi-grey line-clamp-2 mt-1">{p.description}</p>
                  <div className="flex items-center justify-between gap-2 mt-2 sm:mt-3">
                    <span className="font-serif font-extrabold text-base sm:text-lg">{formatPrice(p.price)}{p.comparePrice && <span className="hidden min-[340px]:inline ml-2 text-xs text-sabi-grey line-through font-sans font-medium">{formatPrice(p.comparePrice)}</span>}</span>
                    <QuickAdd productId={p.id} inStock={p.stock > 0} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-14 px-4 card-product">
            <p className="text-6xl mb-4">🍽</p>
            <p className="font-serif font-bold text-2xl mb-2">Nothing here yet</p>
            <p className="text-sabi-grey text-sm mb-6">{active ? "This section is empty right now." : "The menu is being updated."}</p>
            {active && <Link href="/products" className="btn-outline">See everything</Link>}
          </div>
        )}
      </div>
    </div>
  );
}
