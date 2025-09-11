import { BubbleList } from "@matechat/react/bubble";
import { Button } from "@matechat/react/button";
import { FileUpload } from "@matechat/react/file-upload";
import {
  Prompt,
  PromptDescription,
  Prompts,
  PromptTitle,
} from "@matechat/react/prompt";
import { InputCount, Sender } from "@matechat/react/sender";
import type { MessageParam } from "@matechat/react/utils";
import { useChat } from "@matechat/react/utils/chat";
import { useMateChat } from "@matechat/react/utils/core";
import { MessageSquarePlus } from "lucide-react";
import { useMemo, useState } from "react";

const initialMessages: MessageParam[] = [
  {
    id: "1",
    role: "user",
    content: "How to use MateChat React?",
    align: "right",
  },
  {
    id: "2",
    role: "assistant",
    content: `# Getting Started

## Prerequisites

> MateChat React is a React frontend components and helpers library, we recommend that you use React 18 or above.

If you are looking for the Vue MateChat version, please visit [MateChat Vue](https://matechat.gitcode.com/).

## Quick Start

If you wish to try a brand-new MateChat React project, feel free to use the MateChat CLI to create a template project.

\`\`\`bash
pnpm create matechat@latest
\`\`\`

## Installation

\`\`\`bash
pnpm add @matechat/react
\`\`\`
      `,
    align: "left",
  },
];

export function Chat() {
  const [prompt, setPrompt] = useState("");

  const { backend } = useMateChat();
  const { messages, input, setMessages, pending } = useChat(
    backend,
    initialMessages,
    {
      throwOnEmptyBackend: true,
    }
  );

  // 新增：处理输入变化的回调函数
  const handleInputChange = (value: string) => {
    setPrompt(value);
  };

  const footer = useMemo(() => {
    const onClear = () => {
      setPrompt("");
      setMessages([]);
    };
    return (
      <Button onClick={onClear} variant="default" className="self-center">
        <MessageSquarePlus size="1.1rem" />
        Start a new conversation
      </Button>
    );
  }, [setMessages]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <main className="flex flex-col items-center justify-center h-[80vh] w-full max-w-3xl p-4 bg-white rounded-lg shadow-md gap-5">
        <BubbleList
          className="px-4 w-full max-w-full"
          messages={messages}
          background="right-solid"
          isPending={pending}
          footer={footer}
        />
        {messages.length === 0 && (
          <Prompts>
            <Prompt>
              <PromptTitle>Understanding the Transformer Model</PromptTitle>
              <PromptDescription>
                Give a detailed analysis of the Transformer model.
              </PromptDescription>
            </Prompt>
            <Prompt size="xs">
              <PromptTitle>Understanding the Attention Mechanism</PromptTitle>
              <PromptDescription>
                Explain the attention mechanism in neural networks.
              </PromptDescription>
            </Prompt>
          </Prompts>
        )}
        <Sender
          className="w-full"
          input={input}
          initialMessage={prompt} // 同步初始值
          onMessageChange={handleInputChange} // 同步变化
          toolbar={
            <div className="flex flex-row justify-between w-full">
              <InputCount count={prompt.length} limit={500} />
              <FileUpload />
            </div>
          }
        />
      </main>
    </div>
  );
}
