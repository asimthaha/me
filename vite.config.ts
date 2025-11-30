import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  // base: "/me/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Ensure single React instance to prevent hook errors
    dedupe: ["react", "react-dom"],
  },
  // --- ADDED THIS BUILD CONFIGURATION ---
  build: {
    // Increase the warning limit to 1000kb (1MB) since modern apps are often larger
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Split Framer Motion into its own chunk (it's heavy)
            if (id.includes("framer-motion")) {
              return "framer-motion";
            }
            // Split Lucide Icons
            if (id.includes("lucide-react")) {
              return "lucide";
            }
            // Split Radix UI components
            if (id.includes("@radix-ui")) {
              return "radix-ui";
            }
            // Everything else goes into a vendor chunk
            return "vendor";
          }
        },
      },
    },
  },
}));
