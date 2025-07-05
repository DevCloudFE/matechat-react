import {
  Prompt,
  PromptDescription,
  Prompts,
  PromptTitle,
} from "@matechat/react";

export default function PromptDemo() {
  return (
    <Prompts
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px", // 每个之间间距
        width: "100%",
      }}
    >
      <Prompt size="lg">
        <PromptTitle>🌟 大号提示</PromptTitle>
        <PromptDescription>
          适合在页面顶部醒目显示的重要信息。
        </PromptDescription>
      </Prompt>

      <Prompt size="md">
        <PromptTitle>📌 中号提示</PromptTitle>
        <PromptDescription>
          常用于普通提示或分块标题下方的补充说明。
        </PromptDescription>
      </Prompt>

      <Prompt size="sm">
        <PromptTitle>💡 小号提示</PromptTitle>
        <PromptDescription>适合在局部或列表里显示简短提示。</PromptDescription>
      </Prompt>

      <Prompt size="xs">
        <PromptTitle>✨ 超小提示</PromptTitle>
        <PromptDescription>可用于非常轻量的标签或注释。</PromptDescription>
      </Prompt>
    </Prompts>
  );
}
