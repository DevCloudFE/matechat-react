import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { createLogger, defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// Suppress warnings from Rolldown Vite
// This is due to compatibility issues with Vite and Rolldown Vite.
const logger = createLogger();
logger.warn = () => {};

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  customLogger: logger,
  resolve: {
    alias: {
      "@matechat/react": path.resolve(__dirname, "../src"),
    },
  },
});
