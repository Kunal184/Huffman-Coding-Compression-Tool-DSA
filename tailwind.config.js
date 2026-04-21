/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'huffman-bg': '#0f172a',
        'huffman-panel': '#1e293b',
        'huffman-accent': '#38bdf8',
        'huffman-node': '#334155',
        'huffman-edge': '#94a3b8',
        'huffman-text': '#f8fafc',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
