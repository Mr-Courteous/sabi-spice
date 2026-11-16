export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import Icon from "@/components/ui/Icon";
import { catEmoji } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Menu",
  description: "Browse our collection of African food, small chops and spices at Sabi Spice.",
};

export default async function ProductsPage({ searchParams }: { searchParams: { category?: string; q?: string } }) {
  const active = searchParams.category;
  const q = searchParams.q?.trim();
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        published: true,
        ...(active ? { category: { slug: active } } : {}),
        ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] } : {}),
      },
      include: { category: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  const current = categories.find((c: any) => c.slug === active);
  const href = (slug?: string) => `/products${slug ? `?category=${slug}` : ""}`;

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl">{q ? `Results for “${q}”` : current ? current.name : "The menu"}</h1>
            <p className="text-sabi-grey text-sm mt-1">{products.length} {products.length === 1 ? "dish" : "dishes"}</p>
          </div>
          <form action="/products" method="get" role="search" className="relative w-full sm:w-80">
            {active && <input type="hidden" name="category" value={active} />}
            <Icon name="search" className="w-[18px] h-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-sabi-grey pointer-events-none" />
            <input name="q" defaultValue={q} placeholder="Search dishes and spices" aria-label="Search the menu" className="w-full pl-11 pr-4 py-3 rounded-full bg-surface ring-1 ring-inset ring-sabi-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-sabi-leaf placeholder:text-sabi-grey/70" />
          </form>
        </div>
      </div>

      {/* Sticky category chips */}
      <div className="sticky top-16 sm:top-[72px] z-30 mt-5 bg-sabi-light/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <Link href="/products" className={`chip ${!active ? "chip-on" : "chip-off"}`}>All</Link>
          {categories.map((c: any) => (
            <Link key={c.slug} href={href(c.slug)} className={`chip ${active === c.slug ? "chip-on" : "chip-off"}`}><span aria-hidden>{catEmoji(c.slug)}</span>{c.name}</Link>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.map((p: any) => <ProductCard key={p.id} p={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-surface rounded-3xl ring-1 ring-sabi-black/5 shadow-soft">
            <p className="text-5xl mb-4">🍽</p>
            <p className="font-display font-bold text-2xl mb-2">{q ? "No matches" : "Nothing here yet"}</p>
            <p className="text-sabi-grey text-sm mb-6">{q ? "Try a different word, or clear the search to see everything." : active ? "This section is empty right now." : "The menu is being updated."}</p>
            {(active || q) && <Link href="/products" className="btn-outline">Show the full menu</Link>}
          </div>
        )}
      </div>
    </div>
  );
}
