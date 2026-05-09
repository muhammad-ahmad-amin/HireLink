export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'upwork-green': '#14a800',
        'upwork-green-dark': '#108a00',
        'upwork-dark': '#001e00',
        'upwork-gray': '#5e6d55',
        'upwork-light': '#f2f7f2',
      },
      boxShadow: {
        'premium': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}