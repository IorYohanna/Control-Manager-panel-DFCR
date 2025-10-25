import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      colors: {
        amaranth_purple: {
          DEFAULT: "#a63a50",
          100: "#210c10",
          200: "#421720",
          300: "#642330",
          400: "#852f40",
          500: "#a63a50",
          600: "#c4566c",
          700: "#d28091",
          800: "#e1aab5",
          900: "#f0d5da",
        },
        antique_white: {
          DEFAULT: "#f0e7d8",
          100: "#413319",
          200: "#836533",
          300: "#bc9654",
          400: "#d6be95",
          500: "#f0e7d8",
          600: "#f2ebdf",
          700: "#f6f0e7",
          800: "#f9f5ef",
          900: "#fcfaf7",
        },
        cinereous: {
          DEFAULT: "#ab9b96",
          100: "#241e1d",
          200: "#473c39",
          300: "#6b5b56",
          400: "#8e7973",
          500: "#ab9b96",
          600: "#bcafab",
          700: "#cdc3c0",
          800: "#ddd7d5",
          900: "#eeebea",
        },
        brown_sugar: {
          DEFAULT: "#a1674a",
          100: "#20150f",
          200: "#40291e",
          300: "#603e2c",
          400: "#81523b",
          500: "#a1674a",
          600: "#ba8368",
          700: "#cba28e",
          800: "#dcc1b4",
          900: "#eee0d9",
        },
        feldgrau: {
          DEFAULT: "#4c6663",
          100: "#0f1514",
          200: "#1e2928",
          300: "#2e3e3c",
          400: "#3d5250",
          500: "#4c6663",
          600: "#688d88",
          700: "#8daaa7",
          800: "#b3c7c4",
          900: "#d9e3e2",
        },
      },
      fontFamily: {
        kollektif: ["kollektif", "sans-serif"],
        'eirene-regular' : ["eirene-regular", "sans-serif"],
        'larken-black' : ["larken-black", "serif"],
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
