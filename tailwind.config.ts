import type { Config } from "tailwindcss";

// "Market stall" palette: paper cream, ink green, chili red, turmeric yellow.
// Token names are unchanged so every page inherits the new look.
const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        saffron: { DEFAULT: "#C93F14", light: "#F4B93A", dark: "#9E2F0E", muted: "#FFE7B0" },
        sabi: { black: "#1E2B14", charcoal: "#24501A", dark: "#141D0E", grey: "#5B6650", light: "#FFF6E3", leaf: "#2C5E1A" },
      },
      fontFamily: {
        serif: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
        sans: ["'Manrope'", "system-ui", "sans-serif"],
        script: ["'Great Vibes'", "cursive"],
      },
      backgroundImage: {
        "saffron-gradient": "linear-gradient(90deg, #F4B93A, #C93F14)",
        "saffron-shimmer": "none",
      },
      keyframes: { marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } } },
      animation: { marquee: "marquee 28s linear infinite" },
    },
  },
  plugins: [],
};
export default config;
