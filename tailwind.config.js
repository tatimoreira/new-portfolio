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
        'icon-color': 'rgb(var(--icon-color) / <alpha-value>)',
        'main-color': 'hsl(var(--main-color))',
        'caret-color': "hsl(var(--caret-color) / <alpha-value>)",
        "sub-color": "hsl(var(--sub-color) / <alpha-value>)",
        "dark-sub-color": "hsl(var(--dark-sub-color) / <alpha-value>)",
        "main-color": "hsl(var(--main-color) / <alpha-value>)",
        "dark-text-color": "hsl(var(--dark-text-color) / <alpha-value>)",
        "accent-color": "hsl(var(--accent-color) / <alpha-value>)",
        "text-color": "hsl(var(--text-color) / <alpha-value>)"
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
    require('@tailwindcss/typography'),
    function ({ addVariant }) {
      addVariant('frutiger', 'html.frutiger &');
    },
  ],
};
