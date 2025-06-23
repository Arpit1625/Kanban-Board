// tailwind.config.js
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        danger: '#ef4444',
        success: '#22c55e',
        muted: '#9ca3af'
      },
      keyframes: {
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fade: 'fade 0.5s ease-out',
      },
    },
  },
  plugins: [],
}