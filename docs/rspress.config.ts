import * as path from "node:path";
import { pluginPlayground } from "@rspress/plugin-playground";
import { defineConfig } from "rspress/config";

export default defineConfig({
  plugins: [pluginPlayground()],
  root: path.join(__dirname, "docs"),
  title: "MateChat React",
  icon: "/matechat-react-logo.png",
  logo: {
    light: "/matechat-react-logo.png",
    dark: "/matechat-react-logo.png",
  },
  lang: "zh",
  locales: [
    // todo: 待开发英文文档
    // {
    //   lang: 'en',
    //   // 导航栏切换语言的标签
    //   label: 'English',
    //   title: 'Rspress',
    //   description: 'Static Site Generator',
    // },
    {
      lang: "zh",
      label: "简体中文",
      title: "Rspress",
      description: "静态网站生成器",
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
  builderConfig: {
    resolve: {
      alias: {
        "@matechat/react": path.resolve(__dirname, "../dist"),
      },
    },
  },
  // 引入全局样式
  globalStyles: path.resolve(__dirname, "./docs/style.css"),
  mediumZoom: false,
});
