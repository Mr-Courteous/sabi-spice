import type { Config } from "tailwindcss";

// Sabi Spice brand palette — sampled directly from the logo & flyer artwork:
// deep forest green, antique gold and warm cream.
const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        saffron: { DEFAULT: "#B8892F", light: "#D9AE56", dark: "#8F6A22", muted: "#F3E6C6" },
        sabi: { black: "#16321C", charcoal: "#1E4023", dark: "#0E200F", grey: "#5C6B58", light: "#FBF6EA", leaf: "#2F6B34" },
      },
      fontFamily: {
        serif: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
        sans: ["'Manrope'", "system-ui", "sans-serif"],
        script: ["'Great Vibes'", "cursive"],
      },
      backgroundImage: {
        "saffron-gradient": "linear-gradient(90deg, #D9AE56, #B8892F)",
        "saffron-shimmer": "none",
      },
      keyframes: { marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } } },
      animation: { marquee: "marquee 28s linear infinite" },
    },
  },
  plugins: [],
};
export default config;
