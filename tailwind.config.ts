import type { Config } from "tailwindcss";

// Sabi Spice palette (v3): white/ice backgrounds, deep navy neutrals, indigo-blue accent, purple spark.
// NOTE: token names (saffron/sabi) are legacy — values are the new palette. Rename when the concept redesign starts.
const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: "#4F46E5", // Indigo blue (primary accent, buttons, links)
          light: "#A5B4FC",   // Periwinkle (highlights on dark backgrounds)
          lighter: "#F0F2FF", // Faint blue tint
          dark: "#3730A3",    // Deep indigo (hover / pressed)
          muted: "#E3E7FF",   // Soft blue-lilac (muted fills)
          spice: "#9333EA",   // Purple spark (secondary accent)
          glow: "#C7D2FE",    // Soft blue glow
        },
        sabi: {
          dark: "#080C24",    // Midnight navy
          black: "#101840",   // Deep navy (text & borders)
          charcoal: "#1B2766",// Regal dark indigo
          leaf: "#2E3A9F",    // Primary brand royal indigo ("Sabi" wordmark)
          emerald: "#4B57D6", // Bright blue-violet for hovers
          fresh: "#1E9E74",   // Mint green for in-stock badges
          light: "#F9FAFF",   // Ice-white page background
          cream: "#EEF1FC",   // Pale periwinkle
          grey: "#5B6488",    // Muted slate-blue for secondary text
        },
      },
      fontFamily: {
        serif: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
        sans: ["'Manrope'", "system-ui", "sans-serif"],
        script: ["'Great Vibes'", "cursive"],
      },
      backgroundImage: {
        "saffron-gradient": "linear-gradient(135deg, #A5B4FC 0%, #4F46E5 50%, #3730A3 100%)",
        "saffron-shimmer": "linear-gradient(90deg, #3730A3 0%, #4F46E5 25%, #DDE3FF 50%, #4F46E5 75%, #3730A3 100%)",
        "sabi-gradient": "linear-gradient(145deg, #2E3A9F 0%, #1B2766 60%, #101840 100%)",
      },
      boxShadow: {
        "sabi-sm": "2px 2px 0 0 #101840",
        "sabi-md": "4px 4px 0 0 #101840",
        "sabi-lg": "6px 6px 0 0 #101840",
        "saffron-glow": "0 8px 24px -4px rgba(79, 70, 229, 0.35)",
        "emerald-glow": "0 8px 24px -4px rgba(46, 58, 159, 0.25)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        goldShimmer: {
          "0%": { backgroundPosition: "100% 0" },
          "50%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "100% 0" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        shimmer: "goldShimmer 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
