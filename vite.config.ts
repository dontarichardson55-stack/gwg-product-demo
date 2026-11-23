import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// Standalone demo build: no Convex client, no auth provider, no platform server.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react/jsx-runtime", "react-dom", "react-dom/client"],
  },
  server: {
    // Exposed for the Cloud preview proxy; allowed hosts come from
    // __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS so no hostname is committed.
    host: true,
    port: 3000,
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
  },
});
