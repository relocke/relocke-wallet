import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "src",
  server: {
    port: 5173,
  },
  build: {
    outDir: "../dist/renderer", // This remains unchanged
    emptyOutDir: true,
  },
  base: "./",
  publicDir: "./src/assets",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Optional alias for src
    },
  },
});
