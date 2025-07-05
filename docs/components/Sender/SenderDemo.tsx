import { Sender } from "@matechat/react";
import "../../docs/style.css";
// 模拟后端接口类型
const fakeBackend = {
  input: (
    message: string,
    options: { callbacks: { onFinish: () => void }; signal: AbortSignal },
  ) => {
    console.log("发送消息:", message);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        options.callbacks.onFinish();
        resolve();
      }, 1500);
    });
  },
};

export default function SenderDemo() {
  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <Sender
        initialMessage="Hello, MateChat!"
        placeholder="输入消息，按 Enter 发送"
        input={fakeBackend.input}
        onMessageChange={(msg: string) => {
          console.log("内容变化:", msg);
        }}
        onSend={(controller: any) => {
          console.log(
            "消息发送开始，AbortController 可用于取消请求",
            controller,
          );
        }}
      />
    </div>
  );
}
