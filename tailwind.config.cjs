/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,svelte}"],
  theme: {
    extend: {
      colors: {
        "zinc-950": "rgb(12, 12, 13)",
        "zinc-850": "rgb(32, 32, 34)",
        "zinc-750": "rgb(51, 51, 56)",
        "zinc-650": "rgb(73, 73, 81)",
      },
      boxShadow: {
        xs: "0 1px 1px 0 rgb(0 0 0 / 0.05)",
      },
    },
  },
  plugins: [],
};
