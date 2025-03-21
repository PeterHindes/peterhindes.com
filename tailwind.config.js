/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-pangolin)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        marker: ['var(--font-permanent-marker)', 'cursive'],
      },
      colors: {
        primary: {
          60: 'rgba(15, 60, 30, 0.6)',
          80: 'rgba(15, 60, 30, 0.8)',
          100: 'rgba(15, 60, 30, 1)',
        },
        blueprint: {
          bg: '#efeae0',
          text: '#0e0e32',
          'grid-major': 'rgba(40, 140, 70, 0.2)',
          'grid-minor': 'rgba(40, 140, 70, 0.08)',
        },
        site: {
          bg: '#d7d1bb',
          text: '#2c3e2e',
        },
        card: {
          text: '#f0f0f0',
        },
      },
      borderRadius: {
        card: 'var(--card-border-radius)',
      },
    },
  },
  plugins: [],
}
