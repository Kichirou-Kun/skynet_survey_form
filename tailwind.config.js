/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bodyBg: "#C0DCE7",
        mainColor: "#0CA5F5",
        boxColor: " #FDFDFD",
        textColor: "#6A6A6A",
        errorBg: `rgba(0,0,0,0.08)`,
        hoverBg: "#83d1f8",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
