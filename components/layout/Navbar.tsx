"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Logo from "@/components/ui/Logo";

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

  const active = (href: string) => path === href || (href !== "/" && path.startsWith(href));
  const cart = (
    <Link href="/cart" className="relative flex items-center gap-1.5 bg-saffron text-white font-bold text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-sabi-black">
      🛒 <span className="hidden sm:inline">Order</span>
      {count > 0 && <span className="bg-saffron-light text-sabi-black text-[11px] rounded-full min-w-5 h-5 px-1 flex items-center justify-center border border-sabi-black">{count}</span>}
    </Link>
  );

  return (
    <>
      {/* Floating pill navigation */}
      <header className="fixed top-2 sm:top-3 inset-x-0 z-50 px-2 min-[360px]:px-3">
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-2 bg-white border-2 border-sabi-black rounded-full pl-2 sm:pl-3 pr-1.5 sm:pr-2 py-1 sm:py-1.5 shadow-[3px_3px_0_0_#16321C]">
          <Logo size="sm" />
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${active(l.href) ? "bg-sabi-black text-white" : "hover:bg-saffron-muted"}`}>{l.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2 relative">
            {!isAdmin && cart}
            {session ? (
              <>
                <button onClick={() => setOpen(!open)} aria-label="Account" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-saffron-light border-2 border-sabi-black font-bold">
                  {(session.user?.name || session.user?.email || "U")[0].toUpperCase()}
                </button>
                {open && (
                  <div className="absolute right-0 top-11 w-44 max-w-[calc(100vw-1.5rem)] bg-white border-2 border-sabi-black rounded-2xl shadow-[4px_4px_0_0_#16321C] overflow-hidden text-sm font-semibold">
                    {isAdmin && <Link href="/admin" className="block px-4 py-3 hover:bg-saffron-muted">⚙ Admin</Link>}
                    <Link href="/account/orders" className="block px-4 py-3 hover:bg-saffron-muted">📦 My orders</Link>
                    <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full text-left px-4 py-3 text-saffron hover:bg-saffron-muted border-t border-sabi-black/10">↩ Sign out</button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/login" className="hidden sm:block px-4 py-2 rounded-full text-sm font-bold hover:bg-saffron-muted">Sign in</Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t-2 border-sabi-black grid grid-cols-5 font-bold pb-[env(safe-area-inset-bottom)]">
        {([["/", "🏠", "Home", "Home"], ["/products", "🍽", "Menu", "Menu"], ["/catering", "🎉", "Cater", "Catering"], ["/cart", "🛒", "Order", "Order"], [session ? "/account/orders" : "/login", "👤", session ? "Me" : "Login", session ? "Me" : "Sign in"]] as string[][]).map(([href, icon, short, long]) => (
          <Link key={href} href={href} className={`relative min-w-0 flex flex-col items-center gap-0.5 py-1.5 min-[340px]:py-2 text-[10px] min-[340px]:text-[11px] ${active(href) ? "bg-saffron-muted text-saffron" : ""}`}>
            <span className="text-base min-[340px]:text-lg leading-none">{icon}</span>
            <span className="min-[340px]:hidden">{short}</span><span className="hidden min-[340px]:inline truncate max-w-full">{long}</span>
            {href === "/cart" && count > 0 && <span className="absolute top-0.5 right-[14%] bg-saffron text-white text-[9px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center border border-sabi-black">{count}</span>}
          </Link>
        ))}
      </nav>
    </>
  );
}
