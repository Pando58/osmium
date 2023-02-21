/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

function remToEm(str) {
  return `${str.split("rem").shift()}em`;
}

const spacing_em = Object.fromEntries(
  Object.entries(defaultTheme.spacing)
    .filter(([_, v]) => {
      return v.includes("rem");
    })
    .map(([k, v]) => {
      return [`${k}-em`, remToEm(v)];
    })
);

const fontSize_em = Object.fromEntries(
  Object.entries(defaultTheme.fontSize).map(([k, v]) => {
    return [
      `${k}-em`,
      [
        remToEm(v[0]),
        v[1].lineHeight.includes("rem")
          ? { lineHeight: remToEm(v[1].lineHeight) }
          : v[1],
      ],
    ];
  })
);

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
      spacing: spacing_em,
      fontSize: fontSize_em,
    },
  },
  plugins: [],
};
