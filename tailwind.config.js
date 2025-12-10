// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#8ED26B', // Use static color name
        'hover-green': '#72b852',   // Use static color name
      },
    },
  },
  plugins: [],
};