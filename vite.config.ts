import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";

export default defineConfig({
  build: {
    lib: {
      name: "index",
      entry: "./src/index.ts",
      formats: ["es"],
    },
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false,
      },
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react-markdown",
        "react-syntax-highlighter",
        "remark-gfm",
        "remark-math",
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: path.resolve(__dirname, "src"),
        entryFileNames: (info) => {
          if (info.facadeModuleId?.includes("node_modules")) {
            const idx = info.facadeModuleId.lastIndexOf("node_modules");
            const relativePath = info.facadeModuleId.slice(
              idx + "node_modules/".length,
            );
            return path.join("modules", relativePath);
          }
          // Rolldown cannot handle non-posix paths, so we handle manually
          if (info.facadeModuleId?.includes("src")) {
            const idx = info.facadeModuleId.lastIndexOf("src");
            const relativeDir = path.dirname(
              info.facadeModuleId.slice(idx + "src/".length),
            );
            return path.join(relativeDir, `${info.name}.js`);
          }
          return "[name].js";
        },
        chunkFileNames: "[name]-[hash].js",
      },
    },
  },
  plugins: [react(), tailwindcss(), dts(), libInjectCss()],
});
