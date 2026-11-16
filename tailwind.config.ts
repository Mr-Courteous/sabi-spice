import type { Config } from "tailwindcss";

let typography: any[] = [];
try { typography = [require("@tailwindcss/typography")]; } catch {}

// Colours are CSS variables (see globals.css) so the shop can run in a dark "cinematic" theme
// while the admin keeps the light one.
const v = (n: string) => `rgb(var(--${n}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sabi: { light: v("bg"), black: v("ink"), dark: v("deep"), charcoal: v("panel"), leaf: v("leaf"), emerald: v("fresh"), grey: v("mute") },
        surface: v("surface"),
        saffron: { DEFAULT: v("accent"), dark: v("accent-dark"), light: v("accent-light"), lighter: v("accent-lighter"), muted: v("accent-muted") },
        gold: v("gold"),
      },
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Instrument Serif", "Georgia", "serif"],
        serif: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"], // legacy alias: old bold headings stay sans
        script: ["Great Vibes", "cursive"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(18,48,30,.06), 0 10px 24px -14px rgba(18,48,30,.25)",
        lift: "0 2px 4px rgba(18,48,30,.08), 0 24px 48px -18px rgba(18,48,30,.35)",
      },
      backgroundImage: { "saffron-gradient": "linear-gradient(135deg, #FFB84D 0%, #D63A0A 100%)" },
      keyframes: { marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } } },
      animation: { marquee: "marquee 30s linear infinite" },
    },
  },
  plugins: typography,
};
export default config;
