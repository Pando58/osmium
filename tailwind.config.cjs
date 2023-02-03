/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,svelte}"],
  theme: {
    extend: {
      colors: {
        "zinc-950": "rgb(12, 12, 13)",
        "zinc-850": "rgb(32, 32, 34)",
      },
    },
  },
  plugins: [],
};
