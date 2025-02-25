import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "html-transform-csp",
      transformIndexHtml(html) {
        if (process.env.NODE_ENV === "development") {
          return html.replace(
            `<meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline';"
    />`,
            `<meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    />`
          );
        }
      },
    },
  ],
  define: {
    __DEV__: process.env.NODE_ENV === "development",
  },
  css: {
    modules: {
      generateScopedName: "[name]__[local]__[hash:base64:5]",
      scopeBehaviour: "local",
    },
  },
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
