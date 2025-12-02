import path from "node:path";
import { pluginApiDocgen } from "@rspress/plugin-api-docgen";
import { pluginPreview } from "@rspress/plugin-preview";
import { defineConfig } from "rspress/config";
import GitCodeIcon from "./assets/gitcode.ts";

export default defineConfig({
  plugins: [
    pluginApiDocgen({
      entries: {
        bubble: path.resolve(__dirname, "../src/bubble/index.tsx"),
        sender: path.resolve(__dirname, "../src/sender.tsx"),
      },
      apiParseTool: "react-docgen-typescript",
    }),
    pluginPreview({
      defaultRenderMode: "pure",
    }),
  ],
  root: path.join(__dirname, "docs"),
  title: "MateChat React",
  icon: "/matechat-icon.svg",
  logo: "/matechat-icon.svg",
  logoText: "MateChat React",
  markdown: {
    checkDeadLinks: true,
  },
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
        icon: {
          svg: GitCodeIcon,
        },
        mode: "link",
        content: "https://gitcode.com/DevCloudFE/matechat-react",
      },
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/DevCloudFE/matechat-react",
      },
    ],
    hideNavbar: "auto",
    footer: {
      message: "MIT Licensed | © 2025 DevCloudFE. All Rights Reserved.",
    },
  },
  globalStyles: path.resolve(__dirname, "theme/styles/index.css"),
  route: {
    cleanUrls: true,
  },
  mediumZoom: {
    selector: ".rspress-doc",
  },
});
