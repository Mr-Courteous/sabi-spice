export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog",
  description: "Recipes, spice guides and party-planning tips from the Sabi Spice kitchen.",
};

async function getPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}

const SAMPLE_POSTS = [
  { slug: "how-to-use-efirin", title: "How to Use Dry Efirin (Scent Leaf)", excerpt: "A little goes a long way. Here's how to bring that unmistakable aroma to your soups, stews and pepper soup.", category: "Spice Guide", publishedAt: new Date("2026-08-01") },
  { slug: "planning-a-small-chops-party", title: "Planning a Small Chops Party", excerpt: "How much to order, what to serve together, and how to keep everything hot and crispy for your guests.", category: "Events", publishedAt: new Date("2026-08-15") },
  { slug: "zobo-at-home", title: "Zobo at Home with Dried Hibiscus", excerpt: "A simple way to brew a chilled, spiced zobo drink from hibiscus leaves.", category: "Recipes", publishedAt: new Date("2026-09-01") },
];

export default async function BlogPage() {
  const posts = await getPosts();
  const displayPosts = posts.length > 0 ? posts : SAMPLE_POSTS;
  const [featured, ...rest] = displayPosts;

  return (
    <div>
      {/* Hero */}
      <section className="bg-sabi-dark py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 saffron-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-saffron" />
            <p className="text-saffron text-xs tracking-[0.4em] uppercase">Journal</p>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl text-white">The Sabi Spice Blog</h1>
          <p className="text-sabi-grey mt-4 text-lg max-w-lg">Recipes, spice guides and stories from our kitchen.</p>
        </div>
      </section>

      <section className="section-padding bg-sabi-light">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          {/* Featured post */}
          <Link href={`/blog/${featured.slug}`} className="block mb-12 group">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-surface border border-sabi-black/10 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] lg:aspect-auto bg-saffron-muted relative flex items-center justify-center min-h-[280px]">
                {(featured as any).image ? (
                  <Image src={(featured as any).image} alt={featured.title} fill className="object-cover" />
                ) : (
                  <span className="font-serif text-9xl text-saffron opacity-10">SS</span>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-saffron text-sabi-black text-xs font-bold px-3 py-1.5 uppercase tracking-wide">Featured</span>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                {featured.category && (
                  <p className="text-saffron text-xs tracking-[0.3em] uppercase mb-3">{featured.category}</p>
                )}
                <h2 className="font-serif text-3xl lg:text-4xl text-sabi-black group-hover:text-saffron transition-colors leading-tight mb-4">{featured.title}</h2>
                <p className="text-sabi-grey leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-sabi-grey">
                    {new Date(featured.publishedAt!).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <span className="text-saffron text-sm tracking-wide uppercase">Read More →</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Rest of posts */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="card-product group">
                  <div className="aspect-[16/9] bg-saffron-muted relative overflow-hidden flex items-center justify-center">
                    {(post as any).image ? (
                      <Image src={(post as any).image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="font-serif text-6xl text-saffron opacity-10">SS</span>
                    )}
                  </div>
                  <div className="p-6">
                    {post.category && (
                      <p className="text-saffron text-xs tracking-[0.3em] uppercase mb-2">{post.category}</p>
                    )}
                    <h3 className="font-serif text-xl text-sabi-black group-hover:text-saffron transition-colors leading-tight mb-3">{post.title}</h3>
                    <p className="text-sabi-grey text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                    <p className="text-xs text-sabi-grey">
                      {new Date(post.publishedAt!).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
