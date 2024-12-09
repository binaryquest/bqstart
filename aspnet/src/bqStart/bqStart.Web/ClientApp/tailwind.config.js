// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  // variants: {
  //   extend: {
  //     width: ['responsive'],
  //   },
  // },
  plugins: [require('tailwindcss-primeui')]
};
