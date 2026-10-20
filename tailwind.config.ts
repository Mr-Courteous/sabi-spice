import type { Config } from "tailwindcss";

// Sabi Spice brand palette — sampled directly from the logo & flyer artwork:
// deep forest green, antique gold and warm cream.
const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        saffron: { DEFAULT: "#FFFFFF", light: "#FFFFFF", dark: "#F3F4F6", muted: "#F5F6F7" },
        sabi: { black: "#16321C", charcoal: "#1E4023", dark: "#0E200F", grey: "#5C6B58", light: "#FFFFFF", leaf: "#2F6B34" },
      },
      fontFamily: {
        serif: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
        sans: ["'Manrope'", "system-ui", "sans-serif"],
        script: ["'Great Vibes'", "cursive"],
      },
      backgroundImage: {
        "saffron-gradient": "linear-gradient(90deg, #FFFFFF, #F3F4F6)",
        "saffron-shimmer": "none",
      },
      keyframes: { marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } } },
      animation: { marquee: "marquee 28s linear infinite" },
    },
  },
  plugins: [],
};
export default config;
