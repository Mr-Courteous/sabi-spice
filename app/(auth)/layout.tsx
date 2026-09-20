import type { Metadata } from "next";

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
  return <>{children}</>;
}
