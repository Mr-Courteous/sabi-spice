"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Logo from "@/components/ui/Logo";
import Icon from "@/components/ui/Icon";

const links = [
  { href: "/products", label: "Menu" },
  { href: "/catering", label: "Catering" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const path = usePathname();
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const refresh = async () => {
      try { const r = await fetch("/api/cart/count"); if (r.ok) setCount((await r.json()).count || 0); } catch {}
    };
    (window as any).__refreshCartCount = refresh;
    refresh();
    const t = setInterval(refresh, 30000);
    return () => clearInterval(t);
  }, [session]);
  useEffect(() => setOpen(false), [path]);

  const active = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href));

  const tabs: [string, string, string][] = [
    ["/", "home", "Home"],
    ["/products", "menu", "Menu"],
    ["/catering", "party", "Catering"],
    ["/cart", "bag", "Order"],
    [session ? "/account/orders" : "/login", "user", session ? "Account" : "Sign in"],
  ];

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-sabi-light/60 backdrop-blur-xl border-b border-sabi-black/10">
        <div className="mx-auto max-w-6xl h-16 sm:h-[72px] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <Logo size="sm" />
          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`relative px-3.5 py-2 text-sm font-semibold transition-colors ${active(l.href) ? "text-saffron" : "text-sabi-grey hover:text-sabi-black"}`}>
                {l.label}
                {active(l.href) && <span className="absolute left-3.5 right-3.5 -bottom-[13px] h-0.5 rounded-full bg-saffron" />}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 relative">
            <Link href="/products" aria-label="Search the menu" className="w-10 h-10 rounded-full grid place-items-center text-sabi-black hover:bg-sabi-dark/5 transition-colors">
              <Icon name="search" />
            </Link>
            {!isAdmin && (
              <Link href="/cart" className="hidden md:flex items-center gap-2 bg-saffron hover:bg-saffron-dark text-[rgb(var(--on-accent))] text-sm font-bold rounded-full pl-4 pr-3 py-2 transition-colors">
                <Icon name="bag" className="w-[18px] h-[18px]" /> Order
                <span className={`min-w-6 h-6 px-1.5 rounded-full text-xs font-extrabold grid place-items-center ${count > 0 ? "bg-black/25" : "bg-black/15"}`}>{count}</span>
              </Link>
            )}
            {session ? (
              <>
                <button onClick={() => setOpen(!open)} aria-label="Account" aria-expanded={open} className="w-10 h-10 rounded-full bg-saffron-muted text-saffron-dark font-extrabold grid place-items-center ring-1 ring-saffron/20">
                  {(session.user?.name || session.user?.email || "U")[0].toUpperCase()}
                </button>
                {open && (
                  <div className="absolute right-0 top-12 w-48 bg-surface rounded-2xl shadow-lift ring-1 ring-sabi-black/5 overflow-hidden text-sm font-semibold">
                    {isAdmin && <Link href="/admin" className="block px-4 py-3 hover:bg-sabi-dark/5">Admin dashboard</Link>}
                    <Link href="/account/orders" className="block px-4 py-3 hover:bg-sabi-dark/5">My orders</Link>
                    <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full text-left px-4 py-3 text-saffron-dark hover:bg-saffron-muted border-t border-sabi-black/5">Sign out</button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/login" className="hidden sm:inline-flex px-4 py-2 rounded-full text-sm font-bold text-sabi-black ring-1 ring-inset ring-sabi-black/25 hover:ring-saffron hover:text-saffron transition-colors">Sign in</Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav aria-label="Primary" className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-sabi-light/90 backdrop-blur-xl border-t border-sabi-black/10 grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(([href, icon, label]) => {
          const on = active(href);
          return (
            <Link key={href} href={href} className={`relative flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-semibold transition-colors ${on ? "text-saffron" : "text-sabi-grey"}`}>
              {on && <span className="absolute top-0 h-[3px] w-8 rounded-b-full bg-saffron" />}
              <span className="relative">
                <Icon name={icon} className="w-6 h-6" />
                {href === "/cart" && count > 0 && <span className="absolute -top-1.5 -right-2.5 bg-saffron text-[rgb(var(--on-accent))] text-[10px] font-extrabold rounded-full min-w-[18px] h-[18px] px-1 grid place-items-center">{count}</span>}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
