import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

function absUrl(url: string) {
  if (url.startsWith("http")) return url;
  const base = process.env.NEXT_PUBLIC_SITE_URL
    || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`)
    || "https://sabispice.com";
  return `${base.replace(/\/+$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
}

export const metadata: Metadata = {
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Sabi Spice",
    images: [{ url: absUrl("/sabi-logo.png"), width: 800, height: 800, alt: "Sabi Spice" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [absUrl("/sabi-logo.png")],
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="sticky top-0 z-50 bg-white border-b-2 border-sabi-black px-3 py-2 flex items-center justify-between gap-2">
        <Logo size="sm" />
        <Link href="/products" className="text-sm font-bold px-3 py-1.5 rounded-full hover:bg-saffron-muted">← Menu</Link>
      </div>
      {children}
    </>
  );
}
