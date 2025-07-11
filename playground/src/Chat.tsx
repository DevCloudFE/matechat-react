import { MessageSquarePlus } from "lucide-react";
import { useState } from "react";
import { BubbleList } from "../../dist/bubble";
import { Button } from "../../dist/button";
import { FileUpload } from "../../dist/file-upload";
import {
  Prompt,
  PromptDescription,
  Prompts,
  PromptTitle,
} from "../../dist/prompt";
import { InputCount, Sender } from "../../dist/sender";
import type { MessageParam } from "../../dist/utils";
import { useChat } from "../../dist/utils/chat";
import { useMateChat } from "../../dist/utils/core";

export function Chat() {
  const initialMessages: MessageParam[] = [
    {
      role: "user",
      content: "Hello, how are you?",
      avatar: {
        text: "U",
      },
      align: "right",
    },
    {
      role: "assistant",
      content:
        "I'm doing well, thank you! How can I assist you today? \
        I'm a language model, so I can understand and respond to a wide range of questions and requests. \
      I can help you with a variety of tasks, such as answering questions, providing information, or helping you with a specific problem.",
      avatar: {
        text: "A",
      },
      align: "left",
    },
  ];

  const [prompt, setPrompt] = useState("");

  const { backend } = useMateChat();
  if (!backend) {
    throw new Error("Backend is not initialized");
  }
  const { messages, input, setMessages, isPending } = useChat(
    backend,
    initialMessages,
  );

  const onClear = () => {
    setPrompt("");
    setMessages([]);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <main className="flex flex-col items-center justify-center h-[80vh] w-full max-w-3xl p-4 bg-white rounded-lg shadow-md gap-5">
          <BubbleList
            className="px-4 w-full max-w-full"
            messages={messages}
            background="right-solid"
            isPending={isPending}
            footer={
              <Button
                onClick={onClear}
                variant="default"
                className="self-center"
              >
                <MessageSquarePlus size="1.1rem" />
                Start a new conversation
              </Button>
            }
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
            initialMessage={prompt}
            input={input}
            onMessageChange={setPrompt}
            toolbar={
              <div className="flex flex-row justify-between w-full">
                <InputCount count={prompt.length} limit={500} />
                <FileUpload />
              </div>
            }
          />
        </main>
      </div>
    </>
  );
}
