import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";

export const dynamic = "force-dynamic";

function absUrl(url: string) {
  if (url.startsWith("http")) return url;
  const base = process.env.NEXT_PUBLIC_SITE_URL
    || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`)
    || "https://sabispice.com";
  return `${base.replace(/\/+$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
}

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" as const };

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(absUrl("/")),
    title: { default: "Sabi Spice – Authentic African Food & Spices", template: "%s | Sabi Spice" },
    description: "Authentic African dishes, small chops and spices — freshly made in the US. Order online for pickup, delivery or your next event.",
    keywords: ["African food US", "small chops", "Nigerian catering", "African spices", "puff puff", "Sabi Spice"],
    authors: [{ name: "Sabi Spice" }],
    creator: "Sabi Spice",
    publisher: "Sabi Spice",
    applicationName: "Sabi Spice",
    manifest: "/favicon/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon/favicon.ico", sizes: "any" },
        { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    other: {
      "theme-color": "#4F46E5",
      "apple-mobile-web-app-capable": "yes",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Sabi Spice",
      title: "Sabi Spice – Authentic African Food & Spices",
      description: "Authentic African dishes, small chops and spices — freshly made in the US. Order online for pickup, delivery or your next event.",
      url: absUrl("/"),
      images: [{ url: absUrl("/sabi-logo.png"), width: 800, height: 800, alt: "Sabi Spice" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sabi Spice – Authentic African Food & Spices",
      description: "Authentic African dishes, small chops and spices — freshly made in the US. Order online for pickup, delivery or your next event.",
      images: [absUrl("/sabi-logo.png")],
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: "#101840", color: "#F9FAFF", borderLeft: "4px solid #4F46E5", borderRadius: "14px", boxShadow: "0 10px 30px rgba(16,24,64,0.25)" },
              success: { iconTheme: { primary: "#4F46E5", secondary: "#F9FAFF" } },
            }}
          />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
