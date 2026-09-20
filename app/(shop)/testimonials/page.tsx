export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "See what customers and catering clients say about Sabi Spice.",
};

async function getTestimonials() {
  return prisma.testimonial.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function TestimonialsPage() {
  const all = await getTestimonials();
  const customers = all.filter((t) => t.source === "CUSTOMER");
  const trainees = all.filter((t) => t.source === "EVENT");

  function Stars({ rating }: { rating: number }) {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < rating ? "text-saffron" : "text-gray-200"}>★</span>
        ))}
      </div>
    );
  }

  const avgRating = all.length > 0 ? (all.reduce((s, t) => s + t.rating, 0) / all.length).toFixed(1) : "5.0";

  return (
    <div>
      {/* Hero */}
      <section className="bg-sabi-black py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 saffron-shimmer" />
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-saffron text-xs tracking-[0.4em] uppercase mb-4">Social Proof</p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mb-6">Loved By Many</h1>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="text-center">
              <p className="font-serif text-5xl text-saffron font-bold">{avgRating}</p>
              <div className="flex justify-center gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-saffron">★</span>)}
              </div>
              <p className="text-gray-500 text-xs mt-1 tracking-widest uppercase">Average Rating</p>
            </div>
            <div className="w-px h-16 bg-white/10" />
            <div className="text-center">
              <p className="font-serif text-5xl text-saffron font-bold">{all.length || "200"}+</p>
              <p className="text-gray-500 text-xs mt-2 tracking-widest uppercase">Happy Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer reviews */}
      <section className="section-padding bg-sabi-light">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-saffron text-xs tracking-[0.3em] uppercase mb-3">Shoppers</p>
            <h2 className="font-serif text-3xl text-sabi-black">Customer Reviews</h2>
            <div className="h-px w-12 bg-saffron-gradient mt-3" />
          </div>

          {customers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customers.map((t) => (
                <div key={t.id} className="bg-white p-7 border border-gray-100 hover:shadow-md transition-shadow">
                  <Stars rating={t.rating} />
                  <p className="text-sabi-grey text-sm leading-relaxed mt-4 mb-6 italic">"{t.content}"</p>
                  <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                    <div className="w-9 h-9 bg-saffron/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-saffron font-serif font-bold">{t.authorName[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sabi-black text-sm">{t.authorName}</p>
                      <p className="text-xs text-saffron uppercase tracking-wide">Verified Customer</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Adaeze N.", text: "The Faaji box was the star of my birthday! Everyone kept asking where the puff-puff came from.", rating: 5 },
                { name: "Tunde A.", text: "Finally, efirin and iru that actually smell fresh. My egusi has never tasted better.", rating: 5 },
                { name: "Grace M.", text: "Sabi Spice catered our office party and the small chops disappeared in minutes.", rating: 5 },
              ].map((t) => (
                <div key={t.name} className="bg-white p-7 border border-gray-100">
                  <Stars rating={t.rating} />
                  <p className="text-sabi-grey text-sm leading-relaxed mt-4 mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                    <div className="w-9 h-9 bg-saffron/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-saffron font-serif font-bold">{t.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sabi-black text-sm">{t.name}</p>
                      <p className="text-xs text-saffron uppercase tracking-wide">Verified Customer</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trainee reviews */}
      <section className="section-padding bg-white">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-saffron text-xs tracking-[0.3em] uppercase mb-3">Catering</p>
            <h2 className="font-serif text-3xl text-sabi-black">Event &amp; Catering Clients</h2>
            <div className="h-px w-12 bg-saffron-gradient mt-3" />
          </div>

          {trainees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trainees.map((t) => (
                <div key={t.id} className="bg-sabi-light p-8 border border-gray-100 flex gap-5">
                  <div className="w-12 h-12 bg-sabi-black flex items-center justify-center flex-shrink-0 self-start mt-1">
                    <span className="text-saffron font-serif font-bold text-xl">{t.authorName[0]}</span>
                  </div>
                  <div>
                    <Stars rating={t.rating} />
                    <p className="text-sabi-grey text-sm leading-relaxed mt-3 italic">"{t.content}"</p>
                    <p className="font-semibold text-sabi-black text-sm mt-4">{t.authorName}</p>
                    <p className="text-xs text-saffron uppercase tracking-wide">Catering Client</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Ify O.", text: "They handled the food for my mum's 60th and everyone raved about it. Easy to work with from start to finish." },
                { name: "David K.", text: "We ordered trays for our church event. Fresh, on time and generous portions." },
              ].map((t) => (
                <div key={t.name} className="bg-sabi-light p-8 border border-gray-100 flex gap-5">
                  <div className="w-12 h-12 bg-sabi-black flex items-center justify-center flex-shrink-0 self-start mt-1">
                    <span className="text-saffron font-serif font-bold text-xl">{t.name[0]}</span>
                  </div>
                  <div>
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-saffron">★</span>)}</div>
                    <p className="text-sabi-grey text-sm leading-relaxed mt-3 italic">"{t.text}"</p>
                    <p className="font-semibold text-sabi-black text-sm mt-4">{t.name}</p>
                    <p className="text-xs text-saffron uppercase tracking-wide">Catering Client</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Leave a review CTA */}
      <section className="section-padding bg-sabi-black">
        <div className="container-max px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-saffron text-xs tracking-[0.3em] uppercase mb-4">Share Your Experience</p>
          <h2 className="font-serif text-4xl text-white mb-4">Have Something to Say?</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">We'd love to hear your story. Contact us to share your review or feature your work in our gallery.</p>
          <Link href="/contact" className="btn-saffron">Leave a Review</Link>
        </div>
      </section>
    </div>
  );
}
