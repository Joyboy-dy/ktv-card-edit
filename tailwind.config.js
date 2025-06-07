import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "rgb(228 233 237)",
        input: "rgb(228 233 237)",
        ring: "rgb(158 170 182)",
        background: "rgb(255 255 255)",
        foreground: "rgb(28 30 36)",
        primary: {
          DEFAULT: "rgb(28 30 36)",
          foreground: "rgb(250 251 252)",
        },
        secondary: {
          DEFAULT: "rgb(245 248 250)",
          foreground: "rgb(28 30 36)",
        },
        muted: {
          DEFAULT: "rgb(245 248 250)",
          foreground: "rgb(117 126 137)",
        },
        accent: {
          DEFAULT: "rgb(245 248 250)",
          foreground: "rgb(28 30 36)",
        },
        destructive: {
          DEFAULT: "rgb(204 30 30)",
          foreground: "rgb(250 251 252)",
        },
        popover: {
          DEFAULT: "rgb(255 255 255)",
          foreground: "rgb(28 30 36)",
        },
        card: {
          DEFAULT: "rgb(255 255 255)",
          foreground: "rgb(28 30 36)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config; 