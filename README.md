<!-- markdownlint-disable MD041 -->
<div align="center">
  <h1>MateChat React</h1>
</div>

<div align="center">

MateChat React is the React version of [MateChat](https://github.com/DevCloudFE/MateChat), a front-end AI scenario solution UI library based on Huawei DevUI Design.

[![npm Version](https://img.shields.io/npm/v/@matechat/react.svg)](https://www.npmjs.com/package/@matechat/react)
[![npm Downloads](https://img.shields.io/npm/dm/@matechat/react.svg)](https://www.npmjs.com/package/@matechat/react)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

</div>

<div align="center">

English | [简体中文](./README.zh-CN.md)

</div>

---

## Introduction

**MateChat React** is a React component library designed for AI-driven interfaces, such as chat assistants, prompt tools, agent frameworks, and more. It is the React version of [MateChat](https://github.com/DevCloudFE/MateChat), offering consistent features and styles.

MateChat is based on [Huawei DevUI Design](https://devui.design/), offering a modern visual language, consistent user experience, and excellent scalability.

For more information, visit the MateChat React website: [MateChat React](http://matechat.noctisynth.org/)

---

## Features

- 🧠 Built for AI interaction and prompt use-cases
- 🎨 Based on DevUI design system
- ⚛️ Fully typed React + TypeScript components
- 🌗 Built-in light/dark theme switching
- 🔌 Highly customizable & flexible

---

## Quick Start

```bash
# npm
npm install @matechat/react

# or pnpm
pnpm add @matechat/react
```

```tsx
import { Bubble } from "@matechat/react";
import avatar from "./avatar.png";

export default function BubbleDemo() {
  return (
    <div className="bubble-chat">
      <div className="bubble-row left">
        <img src={avatar} alt="Bot" className="avatar" />
        <Bubble text="Hello, how can I help you?" />
      </div>
      <div className="bubble-row right">
        <Bubble text="I want to know the product features!" />
        <img src={avatar} alt="User" className="avatar" />
      </div>
      <div className="bubble-row left">
        <img src={avatar} alt="Bot" className="avatar" />
        <Bubble text="OK, please wait..." isPending />
      </div>
    </div>
  );
}
```

---

## Documentation

The documentation is still in progress, but you can feel free to create a new issue in [GitCode](https://gitcode.com/DevCloudFE/MateChat/issues) or [GitHub](https://github.com/DevCloudFE/MateChat/issues) to submit your questions or suggestions. This project is still under development, so the documentation is not complete yet, some features may change in the future.

For more information, please track the progress in [#5](https://github.com/DevCloudFE/matechat-react/issues/5).

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=DevCloudFE/matechat-react&type=Date)](https://www.star-history.com/#DevCloudFE/matechat-react&Date)

---

## Contribution

We welcome all kinds of contributions:

- File issues for bugs or features
- Create pull requests
- Help with documentation or translations

**Contributors:**

<a href="https://github.com/DevCloudFE/matechat-react/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=DevCloudFE/matechat-react" alt="DevCloudFE/matechat-react contributors"/>
</a>

---

## Contact Us

|                                              MateChat React Chat Group                                               |                                         SOA Chat Group                                         |
| :------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------: |
| [<img alt="MateChat React Chat Group" src="./assets/matechat-react-qq-group.jpg" />](https://qm.qq.com/q/aMLehEXzBm) | [<img alt="SOA Chat Group" src="./assets/soa-qq-group.jpg" />](https://qm.qq.com/q/lOocKriX74) |

## License

This project is licensed under the [MIT License](./LICENSE).
