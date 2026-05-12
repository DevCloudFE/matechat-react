import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { createLogger, defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

const logger = createLogger();
logger.warn = () => {};

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  customLogger: logger,
  define: {
    "process.env.MODEL_API_KEY": JSON.stringify(process.env.VITE_MODEL_API_KEY),
  },
  resolve: {
    alias: {
      "@matechat/react": path.resolve(__dirname, "../src"),
    },
  },
});
