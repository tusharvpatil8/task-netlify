/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        xs: '1rem',
        sm: '1rem',
        md: '1rem',
        lg: '1rem',
        xl: '1rem',
        '2xl': '1rem',
        '3xl': '2rem'
      },
    },
    fontFamily: {
      sans: [
        "Arial",
      ],
    },
    screens: {
      xs: "576",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      boxShadow: {},
      colors: {
        primary: "#003A7b",
        white: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
