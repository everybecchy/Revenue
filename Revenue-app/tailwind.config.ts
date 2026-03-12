/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#06b6d4',      // Teal/Tiffany
        'primary-light': '#67e8f9',
        'primary-dark': '#0891b2',
        secondary: '#f472b6',    // Pink claro
        'secondary-light': '#fbcfe8',
        'secondary-dark': '#ec4899',
        background: '#f8fafc',
        foreground: '#0f172a',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
