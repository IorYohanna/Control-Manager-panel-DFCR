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
        stardom: ["Stardom", "sans-serif"],
        necoBlack: ["Neco Black", "serif"],
        necoMedium: ["Neco Medium", "serif"],
      },

      colors: {},
    },
  },
  plugins: [react(), tailwindcss()],
  define: {
    global: "window",
  },
});
