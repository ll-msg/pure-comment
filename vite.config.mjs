import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig({
  base: "/pure-comment/",
  plugins: [
    react(),
  ],
  build: {
    outDir: "docs", 
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        promo: resolve(__dirname, "promo.html"),
      },
    },
  },
})
