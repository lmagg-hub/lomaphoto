import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0a0a0a',
          100: '#111111',
          200: '#1a1a1a',
          300: '#252525',
          400: '#333333',
        },
        gold: {
          DEFAULT: '#c9a96e',
          light: '#e2c49a',
          dark: '#9c7d4e',
        },
        light: {
          DEFAULT: '#f0f0f0',
          muted: '#a0a0a0',
          dim: '#808080',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.3em',
        wider: '0.15em',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease forwards',
        'hero-gradient': 'heroGradient 20s ease infinite',
        'scroll-bounce': 'scrollBounce 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        heroGradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        scrollBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
