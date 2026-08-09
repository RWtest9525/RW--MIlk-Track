/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0B0F17",
          card: "#131C2E",
          cardBorder: "rgba(255, 255, 255, 0.08)",
          subtle: "#1E293B",
        },
        milk: {
          light: "#F8FAFC",
          cream: "#FFFBEB",
          accent: "#38BDF8",
        },
        status: {
          delivered: "#10B981",
          deliveredGlow: "rgba(16, 185, 129, 0.2)",
          missed: "#F43F5E",
          missedGlow: "rgba(244, 63, 94, 0.2)",
          custom: "#F59E0B",
          customGlow: "rgba(245, 158, 11, 0.2)",
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
