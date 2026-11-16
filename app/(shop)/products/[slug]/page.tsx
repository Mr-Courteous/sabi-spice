export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import AddToCartButton from "@/components/shop/AddToCartButton";
import ProductCard from "@/components/shop/ProductCard";
import { catEmoji } from "@/lib/ui";

function absUrl(url: string) {
  if (url.startsWith("http")) return url;
  const base = process.env.NEXT_PUBLIC_SITE_URL
    || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`)
    || "https://sabispice.com";
  return `${base.replace(/\/+$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return { title: "Product Not Found" };
  const image = product.images[0] || "/sabi-logo.png";
  const ogImage = absUrl(image);
  const title = `${product.name} – Sabi Spice`;
  const description = product.description.slice(0, 155);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 800, height: 800, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, published: true },
    include: { category: true },
  });
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { published: true, id: { not: product.id }, categoryId: product.categoryId ?? undefined },
    take: 4,
    include: { category: true },
  });
  const off = product.comparePrice && product.comparePrice > product.price ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
  const stockText = product.stock > 5 ? "In stock" : product.stock > 0 ? `Only ${product.stock} left` : "Sold out";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
      <nav className="flex items-center gap-2 text-xs text-sabi-grey mb-4" aria-label="Breadcrumb">
        <Link href="/products" className="font-semibold hover:text-sabi-leaf transition-colors">Menu</Link>
        {product.category && <><span>/</span><Link href={`/products?category=${product.category.slug}`} className="hover:text-sabi-leaf transition-colors">{product.category.name}</Link></>}
      </nav>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-start">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24">
          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-[2rem] overflow-hidden bg-saffron-muted shadow-soft">
            {product.images[0]
              ? <Image src={product.images[0]} alt={product.name} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              : <span className="absolute inset-0 grid place-items-center text-8xl">{catEmoji(product.category?.slug)}</span>}
            {off > 0 && <span className="absolute top-4 left-4 bg-saffron text-[rgb(var(--on-accent))] text-xs font-bold px-3 py-1.5 rounded-full">{off}% off</span>}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-3">
              {product.images.slice(1, 5).map((img, i) => (
                <div key={i} className="aspect-square relative rounded-2xl overflow-hidden bg-saffron-muted"><Image src={img} alt={`${product.name} ${i + 2}`} fill sizes="12vw" className="object-cover" /></div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && <Link href={`/products?category=${product.category.slug}`} className="inline-flex items-center gap-1.5 bg-saffron-muted text-saffron-dark text-xs font-bold px-3 py-1.5 rounded-full mb-4">{catEmoji(product.category.slug)} {product.category.name}</Link>}
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight">{product.name}</h1>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="font-display font-extrabold text-3xl text-sabi-black">{formatPrice(product.price)}</span>
            {off > 0 && <span className="text-lg text-sabi-grey line-through">{formatPrice(product.comparePrice!)}</span>}
          </div>

          <p className="text-sabi-grey leading-relaxed mt-5 max-w-prose">{product.description}</p>

          <div className="flex items-center gap-2 mt-5 text-sm font-semibold">
            <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? "bg-sabi-emerald" : "bg-red-500"}`} />
            <span className="text-sabi-black">{stockText}</span>
          </div>

          <div className="mt-6 bg-surface rounded-3xl p-5 sm:p-6 ring-1 ring-sabi-black/5 shadow-soft">
            <AddToCartButton productId={product.id} inStock={product.stock > 0} />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {[["Category", product.category?.name || "—"], ["Prepared by", "Sabi Spice"]].map(([k, v]) => (
              <div key={k} className="bg-surface rounded-2xl px-4 py-3 ring-1 ring-sabi-black/5">
                <dt className="text-xs text-sabi-grey">{k}</dt>
                <dd className="font-bold text-sabi-black mt-0.5">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="pt-14 pb-4">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-5">You might also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {related.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
