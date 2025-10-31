import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        rushford: ["Rushford", "sans-serif"],
        eirene: ["Eirene Sans", "sans-serif"],
        dropline: ["Dropline Regular", "serif"],
      },
      colors: {},
    },
  },
  plugins: [react(), tailwindcss()],
});
