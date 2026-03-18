import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00B964",
          dark: "#008748",
          light: "#E6F9F0",
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#6B6B6B",
          muted: "#9E9E9E",
        },
        bg: {
          white: "#FFFFFF",
          gray: "#F7F7F7",
          faint: "#FAFAFA",
        },
        border: {
          light: "#E8E8E8",
          medium: "#D0D0D0",
        },
        accent: {
          blue: "#1A73E8",
          orange: "#F57C00",
          red: "#E42313",
          yellow: "#FFC629",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
      },
    },
  },
  plugins: [],
};

export default config;
