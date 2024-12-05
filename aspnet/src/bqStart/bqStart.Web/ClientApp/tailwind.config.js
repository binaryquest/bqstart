// tailwind.config.js
module.exports = {
  prefix: 'tw-',
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  variants: {
    extend: {
      width: ['responsive'],
    },
  },
  plugins: [require('tailwindcss-primeui')]
};
