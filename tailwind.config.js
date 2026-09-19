/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-dark": "#0a0a0f",
        "card-dark": "#12121a",
        "border-dark": "#1e1e2e",
        "blue-accent": "#4f8ef7",
        "purple-accent": "#7c5cbf",
        "cyan-accent": "#00d4ff",
        "green-accent": "#00ff88",
      },
      fontFamily: {
        mono: ["'Courier New'", "Courier", "monospace"],
      },
      animation: {
        "float": "float 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "blink": "blink 1s step-end infinite",
        "rotate-slow": "rotate-slow 8s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
        "scan-line": "scan-line 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "rotate-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
    },
  },
  plugins: [],
};
