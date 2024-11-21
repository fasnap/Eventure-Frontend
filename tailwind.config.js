// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this to match your file structure
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['sans-serif'],
      },
      colors: {
        primary: '#333', // Define a primary color for text
        secondary: '#555', // Define a secondary color
        header: '#222', // Custom header color
      },
    },
  },
  plugins: [],
};
