const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  darkMode: "class",
  theme: {

    patterns: {
      opacities: {
        100: "1",
        80: ".80",
        60: ".60",
        40: ".40",
        20: ".20",
        10: ".10",
        5: ".05",
      },
      sizes: {
        1: "0.25rem",
        2: "0.5rem",
        4: "1rem",
        6: "1.5rem",
        8: "2rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        32: "8rem",
      }
    },
    extend: {
      colors: {
        'bkg': 'hsl(var(--bkg) / <alpha-value>)',
        'main-color': 'hsl(var(--main-color))',
        'caret-color': "hsl(259.26, 51.59%, 69.22%)",
        "sub-color": "hsl(165.18, 64.89%, 74.31%)",
        "light-text-color": "hsl(168.84, 100%, 33.73%)",
        "dark-text-color": "hsl(259.26, 51.59%, 69.22%)",
        "link-color": "hsl(334.41, 71.58%, 62.75%)"
      },
      fontFamily: {
        work: ['"Work Sans"', ...defaultTheme.fontFamily.sans]
      },
      gridTemplateColumns: {
        20: "repeat(20, minmax(0, 1fr))"
      }
    },
  },
  plugins: [
    require('tailwindcss-bg-patterns'),
  ],
};
