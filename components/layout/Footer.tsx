import Link from "next/link";
import NewsletterForm from "@/components/shop/NewsletterForm";

export default function Footer() {
  const cols: [string, [string, string][]][] = [
    ["Order", [["Full menu", "/products"], ["Small chops", "/products?category=small-chops"], ["Spices & leaves", "/products?category=spices-leaves"], ["Catering", "/catering"]]],
    ["Sabi Spice", [["Our story", "/about"], ["Gallery", "/gallery"], ["Blog", "/blog"], ["FAQ", "/faq"], ["Contact", "/contact"]]],
  ];
  return (
    <footer className="mt-10 bg-sabi-leaf text-white pb-24 md:pb-0 overflow-hidden">
      <div className="saffron-shimmer" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <h3 className="font-serif text-3xl leading-tight mb-3">Get the good stuff first.</h3>
            <p className="text-white/70 text-sm mb-5 max-w-sm">New dishes, spice restocks and event specials, straight to your inbox.</p>
            <NewsletterForm />
          </div>
          {cols.map(([title, items]) => (
            <div key={title}>
              <h4 className="text-saffron-light text-xs font-bold tracking-widest uppercase mb-4">{title}</h4>
              <ul className="space-y-2.5">{items.map(([l, h]) => <li key={h}><Link href={h} className="text-sm text-white/80 hover:text-saffron-light">{l}</Link></li>)}</ul>
            </div>
          ))}
        </div>
        <p className="font-script text-saffron-light/90 leading-[0.8] text-[22vw] md:text-[15vw] mt-10 -mb-[2vw] select-none whitespace-nowrap">Sabi Spice</p>
      </div>
      <div className="bg-sabi-dark text-xs text-white/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-between gap-2">
          <p>© {new Date().getFullYear()} Sabi Spice. All rights reserved.</p>
          <p className="flex gap-5"><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link></p>
        </div>
      </div>
    </footer>
  );
}
