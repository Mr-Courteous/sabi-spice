export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse our portfolio of dishes, spices and events at Sabi Spice.",
};

const CATEGORIES = ["All", "Food Boxes", "Small Chops", "Events", "Spices", "Behind the Scenes"];

async function getGalleryItems() {
  return prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });
}

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-sabi-leaf via-sabi-charcoal to-sabi-dark py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-1 saffron-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-0.5 w-8 bg-saffron-light" />
            <p className="text-saffron-light text-xs tracking-[0.4em] uppercase font-bold">Portfolio</p>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white leading-tight font-extrabold">
            The Gallery
          </h1>
          <p className="text-white/75 mt-4 text-lg max-w-xl leading-relaxed">
            Every piece tells a story. A look at what comes out of the Sabi Spice kitchen: boxes, small chops, spices and the parties we've fed.
          </p>
        </div>
      </section>

      {/* Filter tabs - client component placeholder */}
      <section className="bg-white/95 backdrop-blur-md border-b-2 border-sabi-black/10 sticky top-16 lg:top-20 z-30">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3.5 scrollbar-hide">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                className={`whitespace-nowrap px-4 py-1.5 text-xs tracking-widest uppercase font-sans font-bold rounded-full transition-all ${
                  i === 0
                    ? "bg-sabi-dark text-white shadow-soft"
                    : "text-sabi-grey hover:text-saffron-dark hover:bg-saffron-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding bg-sabi-light">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          {items.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="break-inside-avoid bg-surface overflow-hidden group cursor-pointer border border-sabi-black/10 hover:shadow-lg transition-all">
                  <div className="aspect-square bg-saffron-muted relative overflow-hidden">
                    {item.image ? (
                      <Image src={item.image} alt={item.title || "Gallery image"} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-6xl text-saffron opacity-20">SS</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-sabi-dark/0 group-hover:bg-sabi-dark/40 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">View</span>
                    </div>
                  </div>
                  {(item.title || item.category) && (
                    <div className="p-4">
                      {item.title && <p className="font-serif text-sm text-sabi-black">{item.title}</p>}
                      {item.category && <p className="text-xs text-saffron tracking-wide uppercase mt-0.5">{item.category}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Placeholder grid when no items yet */
            <div>
              <p className="text-center text-sabi-grey text-sm mb-8 italic">Gallery items will appear here once added from the admin panel.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-surface border border-sabi-black/10 flex items-center justify-center group hover:border-saffron/40 transition-colors">
                    <span className="font-serif text-5xl text-saffron opacity-10 group-hover:opacity-20 transition-opacity">SS</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Share your event */}
      <section className="section-padding bg-gradient-to-br from-sabi-leaf via-sabi-charcoal to-sabi-dark text-white">
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-saffron-light text-xs tracking-[0.3em] uppercase mb-4 font-bold">Have photos to share?</p>
          <h2 className="font-serif text-4xl lg:text-5xl text-white mb-4 font-extrabold">Share Your Event</h2>
          <p className="text-white/75 max-w-md mx-auto mb-8 leading-relaxed">
            Had Sabi Spice at your wedding, birthday or gathering? We'd love to feature your photos.
          </p>
          <a href="/contact" className="btn-saffron">Get In Touch</a>
        </div>
      </section>
    </div>
  );
}
