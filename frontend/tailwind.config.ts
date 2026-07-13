import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        hot: {
          50: '#fdf2ef',
          100: '#fae0d8',
          200: '#f5c0b0',
          300: '#ef9b83',
          400: '#e87655',
          500: '#D4542C',
          600: '#b84624',
          700: '#9a3a1e',
          800: '#7d2f19',
          900: '#662715',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
