export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f6edd9",
        ink: "#121212",
        acid: "#d6f43f",
        coral: "#ff6b5a",
        sky: "#69c5ff",
        violet: "#8f73ff",
        gold: "#ffcc4d",
      },
      boxShadow: {
        neo: "8px 8px 0 #121212",
        "neo-lg": "12px 12px 0 #121212",
      },
      fontFamily: {
        display: ["Space Grotesk", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        neo: "1.25rem",
      },
    },
  },
  plugins: [],
};
