/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'huffman-bg': '#ffffff',
        'huffman-panel': '#f3e8ff',
        'huffman-accent': '#7c3aed',
        'huffman-node': '#e9d5ff',
        'huffman-edge': '#6b7280',
        'huffman-text': '#111827',
      },
      fontFamily: {
        mono: ['Inter', 'Segoe UI', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
