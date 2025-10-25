import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        kollektif: ["Kollektif", "sans-serif"],
        eirene: ["Eirene Sans", "sans-serif"],
        larken: ["Larken DEMO Black", "serif"],
      },
      colors: {},
    },
  },
  plugins: [react(), tailwindcss()],
});
