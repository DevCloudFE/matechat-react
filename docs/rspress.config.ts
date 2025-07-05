import * as path from "node:path";
import { pluginPlayground } from "@rspress/plugin-playground";
import { defineConfig } from "rspress/config";

export default defineConfig({
  plugins: [pluginPlayground()],
  root: path.join(__dirname, "docs"),
  title: "MateChat React",
  icon: "/matechat-icon.svg",
  logo: "/matechat-icon.svg",
  lang: "en",
  locales: [
    {
      lang: "en",
      label: "English",
      title: "MateChat React",
      description: "Frontend AI scenario solution based on DevUI Design",
    },
    {
      lang: "zh",
      label: "简体中文",
      title: "MateChat React",
      description: "基于 DevUI 设计的前端 AI 解决方案",
    },
  ],
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/DevCloudFE/matechat-react",
      },
    ],
  },
  globalStyles: path.resolve(__dirname, "./docs/tailwind.css"),
  mediumZoom: {
    selector: ".rspress-doc",
  },
});
