import Link from "next/link";
import NewsletterForm from "@/components/shop/NewsletterForm";

export default function Footer() {
  const cols: [string, [string, string][]][] = [
    ["Order", [["Full menu", "/products"], ["Small chops", "/products?category=small-chops"], ["Spices & leaves", "/products?category=spices-leaves"], ["Catering", "/catering"]]],
    ["Sabi Spice", [["Our story", "/about"], ["Gallery", "/gallery"], ["Blog", "/blog"], ["FAQ", "/faq"], ["Contact", "/contact"]]],
  ];
  return (
    <footer className="mt-12 bg-sabi-dark text-white pb-24 md:pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <h3 className="font-display font-extrabold text-2xl lg:text-3xl leading-tight text-white">Get the good stuff first.</h3>
          <p className="text-white/70 text-sm mt-3 mb-5 max-w-sm leading-relaxed">New dishes, spice restocks and event specials, straight to your inbox.</p>
          <NewsletterForm />
        </div>
        {cols.map(([title, items]) => (
          <div key={title}>
            <h4 className="text-white font-bold text-sm mb-4">{title}</h4>
            <ul className="space-y-3">{items.map(([l, h]) => <li key={h}><Link href={h} className="text-sm text-white/65 hover:text-saffron-light transition-colors">{l}</Link></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 text-xs text-white/55">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap justify-between gap-2">
          <p>© {new Date().getFullYear()} Sabi Spice. Authentic African food &amp; spices made with care in the USA.</p>
          <p className="flex gap-5"><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></p>
        </div>
      </div>
    </footer>
  );
}
