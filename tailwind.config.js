/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#090D16",
          card: "rgba(18, 26, 43, 0.85)",
          cardBorder: "rgba(255, 255, 255, 0.08)",
          subtle: "#162032",
        },
        light: {
          bg: "#F8FAFC",
          card: "rgba(255, 255, 255, 0.9)",
          cardBorder: "rgba(226, 232, 240, 0.8)",
          subtle: "#F1F5F9",
        },
        brand: {
          cyan: "#06B6D4",
          emerald: "#10B981",
          rose: "#F43F5E",
          amber: "#F59E0B",
          purple: "#8B5CF6",
        }
      },
      boxShadow: {
        'glass-dark': '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-light': '0 20px 40px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.35)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.35)',
        'glow-rose': '0 0 25px rgba(244, 63, 94, 0.35)',
        'phone-frame': '0 30px 100px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(6, 182, 212, 0.25)',
      },
      animation: {
        'float-slow': 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
      }
    },
  },
  plugins: [],
}
