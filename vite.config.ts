import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // ADD THIS LINE: This tells Vite to treat .lottie files as static assets
  assetsInclude: ["**/*.lottie"], 
  
  server: {
    host: "::",
    port: 5713,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    tailwindcss(),
    react(), 
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react", 
      "react-dom", 
      "react/jsx-runtime", 
      "react/jsx-dev-runtime", 
      "@tanstack/react-query", 
      "@tanstack/query-core"
    ],
  },
}));