import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const pkg = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf-8"));

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5180,
    proxy: {
      "/gateway-ws": {
        target: "ws://localhost:18789",
        ws: true,
        rewrite: (path) => path.replace(/^\/gateway-ws/, ""),
      },
    },
  },
});
