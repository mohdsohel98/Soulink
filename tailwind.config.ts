import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // jewel-box night backgrounds
        night: "#160d1f",
        "night-2": "#241431",
        "night-3": "#33183f",
        // gold
        gold: "#e8b964",
        "gold-light": "#f3d49a",
        // rose
        rose: "#e8788a",
        "rose-light": "#f6a8b4",
        // cream
        cream: "#fbeede",
        "cream-soft": "#f2d3bf",
        // text
        ivory: "#f7efe7",
        muted: "#b29ab8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-fraunces)", "serif"],
      },
      boxShadow: {
        jewel: "0 30px 80px -20px rgba(0,0,0,.6)",
        "gold-glow": "0 18px 50px -12px rgba(232,185,100,.45)",
        "rose-glow": "0 18px 50px -12px rgba(232,120,138,.45)",
      },
    },
  },
  plugins: [],
} satisfies Config;
