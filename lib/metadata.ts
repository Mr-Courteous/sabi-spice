import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sabispice.com";

export function buildMetadata(overrides: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = overrides.path ? `${siteUrl}${overrides.path}` : siteUrl;

  return {
    title: overrides.title,
    description: overrides.description,
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Sabi Spice",
      title: overrides.title,
      description: overrides.description,
      url,
      images: [{ url: overrides.image || "/sabi-logo.png", width: 800, height: 800, alt: "Sabi Spice" }],
    },
    twitter: {
      card: "summary_large_image",
      title: overrides.title,
      description: overrides.description,
      images: [overrides.image || "/sabi-logo.png"],
    },
  };
}
