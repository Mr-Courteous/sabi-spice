import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-sabi-black">Gallery</h1>
          <p className="text-sabi-grey text-sm mt-1">{items.length} items</p>
        </div>
        <Link href="/admin/gallery/new" className="btn-saffron">+ Add Item</Link>
      </div>
      {items.length === 0 ? (
        <div className="bg-white border border-sabi-black/10 text-center py-20">
          <p className="font-serif text-2xl text-sabi-black mb-2">Gallery is empty</p>
          <p className="text-sabi-grey text-sm mb-6">Add photos of your dishes, spices and events to showcase on the site.</p>
          <Link href="/admin/gallery/new" className="btn-saffron">Add First Item</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((item) => (
            <div key={item.id} className="aspect-square bg-saffron-muted border border-sabi-black/10 relative group overflow-hidden">
              {item.image ? (
                <Image src={item.image} alt={item.title || "Gallery image"} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <span className="font-serif text-4xl text-saffron opacity-20">SS</span>
                </div>
              )}
              <div className="absolute inset-0 bg-sabi-dark/0 group-hover:bg-sabi-dark/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Link href={`/admin/gallery/${item.id}/edit`} className="text-white text-xs uppercase tracking-wide">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
