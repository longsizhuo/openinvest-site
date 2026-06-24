/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1F2937', // titles / dark text
        muted: '#949CA8', // secondary text
        disabled: '#AAB0B8',
        faint: '#EDEFF2', // disabled fill
        canvas: '#F8F9FB', // light section background (flat-diagram theme)
        hero: '#0E1726', // dark hero base
        brand: { DEFAULT: '#2E6FF2', soft: '#E9F0FF' }, // accent / in-progress
        success: { DEFAULT: '#16A062', soft: '#DFF4E9' }, // hit / persistent
        warn: { DEFAULT: '#BE781E', soft: '#FFF7E0', ring: '#E4C26C' }, // lifecycle / loading
        struct: { soft: '#EEE9FF', ring: '#8468E0' }, // structural container
        danger: { DEFAULT: '#D64545', soft: '#FCEAEA' }, // failure
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: { node: '13px' },
    },
  },
  plugins: [],
}
