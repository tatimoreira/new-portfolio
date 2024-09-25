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
        'main-color': 'rgb(245, 177, 204)',
        'caret-color': "rgb(162, 136, 217)",
        "sub-color": "rgb(147, 232, 211)",
        "light-text-color": "rgb(0, 172, 140)",
        "dark-text-color": "rgb(162, 136, 217)",
        "link-color": "rgb(228, 92, 150)"
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
