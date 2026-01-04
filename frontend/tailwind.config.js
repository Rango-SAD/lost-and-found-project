/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          0: "#e8ecff",   // primary text
          1: "#aab0d6",   // secondary text
          2: "#6f76a8",   // muted text
        },
        neon: {
          cyan: "#00f5ff",
          blue: "#4d7cff",
          green: "#39ff88",
          pink: "#ff4fd8",
          purple: "#9b5cff",
          yellow: "#ffe347",
          orange: "#ff9f43",
          red: "#ff5c5c",
        },
      },
      boxShadow: {
        // subtle outer glow used on category edges / pills
        neon: "0 0 22px rgba(255,255,255,0.08)",
      },
    },
  },
  plugins: [],
};
