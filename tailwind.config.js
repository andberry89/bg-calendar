
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: { extend: {
    fontFamily: {
      anton: ["Anton", "sans-serif"],
      public: ["Public Sans", "sans-serif"],
    },
  } },
  plugins: [],
};
