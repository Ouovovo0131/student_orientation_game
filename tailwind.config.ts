import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        cream: "#FFF6D6",
        ink: "#111111",
      },
    },
  },
  plugins: [],
};

export default config;