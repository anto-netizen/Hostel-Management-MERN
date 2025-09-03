/** @type {import('tailwindcss').Config} */
export default {
  // This content array is crucial. It MUST include all files where you use Tailwind classes.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This covers all .jsx, .js, etc., files inside src/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
