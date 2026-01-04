/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          'scan': 'scan 2.5s ease-in-out infinite',
        },
        keyframes: {
          scan: {
            '0%, 100%': { transform: 'translateY(0vh)' },
            '50%': { transform: 'translateY(80vh)' },
          }
        }
      },
    },
    plugins: [],
  }