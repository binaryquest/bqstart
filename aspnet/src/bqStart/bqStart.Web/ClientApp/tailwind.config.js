/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
    "./projects/bq-start-prime/src/**/*.{html,ts}"
  ],
  safelist: [
    'grid',
    'grid-cols-12',
    {pattern: /col-span-./, variants: ['sm', 'md', 'lg', 'xl', '2xl']},
    {pattern: /gap-./, variants: ['sm', 'md', 'lg', 'xl', '2xl']}
  ],
  plugins: [require('tailwindcss-primeui')]
};
