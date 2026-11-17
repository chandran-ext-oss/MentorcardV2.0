/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Satoshi', 'DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Satoshi', 'DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: { ring: { '0%': { boxShadow: '0 0 0 0 rgba(42,175,66,0.45)' }, '100%': { boxShadow: '0 0 0 8px rgba(42,175,66,0)' } } },
      animation: { ring: 'ring 2s ease-out infinite' },
      colors: { ink: '#1c1830', coal: '#2e1f5c', frame: 'rgba(28, 24, 48, 0.4)', accent: '#5b44a8', peach: '#f59e3d', forest: '#1f6f50' },
    },
  },
  plugins: [],
}
