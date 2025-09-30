/** @type {import('tailwindcss').Config} */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { themePalette } = require("./src/app/theme.ts");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          0: themePalette[0],
          1: themePalette[1],
          2: themePalette[2],
          3: themePalette[3],
          4: themePalette[4],
          5: themePalette[5],
          6: themePalette[6],
          7: themePalette[7],
          8: themePalette[8],
          9: themePalette[9],
          DEFAULT: themePalette[6],
        },
        secondary: "#ff1493",
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "foreground-muted": "hsl(var(--foreground-muted))",
        card: "hsl(var(--card))",
        "inside-card": "hsl(var(--inside-card))",
      },
      fontFamily: {
        montserrat: ["'Montserrat Variable', sans-serif"],
      },
    },
  },
  plugins: [],
};
