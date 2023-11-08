/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: {
          primary: "#ED7D31",
          secondary: "#F9B572",
          ternary: "#F6F1EE",
        },
        blue: {
          primary: "#363062",
          secondary: "#6586C9",
          ternary: "#91AFF9",
        },
        green: {
          primary: "#137411",
          secondary: "#76DD52",
        },
        red: {
          primary: "#F14747"
        },
        mono: {
          white: "#FFFFFF",
          off_white: "#F7F7F7",
          light_grey: "#A8A8A8",
          grey: "#6B6B6B",
        }
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
