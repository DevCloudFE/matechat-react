import { useEffect, useState } from "react";
import type { InputOptions } from "./backend";
import type { Backend, EventTypes, Events, MessageParam } from "./types";

export function useChat(
  backend: Backend,
  initialMessages: MessageParam[] = [],
): {
  messages: MessageParam[];
  input: (prompt: string, options?: InputOptions) => Promise<void>;
  on: <K extends EventTypes["type"]>(type: K, handler: Events[K]) => () => void;
  setMessages: React.Dispatch<React.SetStateAction<MessageParam[]>>;
  isPending: boolean;
} {
  const [messages, setMessages] = useState<MessageParam[]>(initialMessages);
  const [isPending, setIsPending] = useState(false);

  const input = async (prompt: string, options?: InputOptions) => {
    setIsPending(true);
    return backend.input(prompt, {
      messages,
      ...options,
    });
  };

  const on = <K extends EventTypes["type"]>(
    type: K,
    handler: Events[K],
  ): (() => void) => {
    return backend.on(type, handler);
  };

  useEffect(() => {
    const cleanCbs: (() => void)[] = [
      backend.on("input", (event) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "user",
            name: "User",
            content: event.payload.prompt,
            avatar: {
              text: "U",
            },
            align: "right",
          },
        ]);
      }),
      backend.on("message", (event) => {
        setMessages((prevMessages) => [...prevMessages, event.payload]);
      }),
      backend.on("error", (event) => {
        setIsPending(false);
        console.error("Error from backend:", event.payload.error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "system",
            name: "Error",
            content: event.payload.error,
            align: "center",
          },
        ]);
      }),
      backend.on("finish", (event) => {
        setIsPending(false);
      }),
      backend.on("chunk", (event) => {
        setIsPending(false);
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === "assistant") {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                content: lastMessage.content + event.payload.chunk,
              },
            ];
          }
          return [
            ...prev,
            {
              role: "assistant",
              content: event.payload.chunk,
              avatar: {
                text: "A",
              },
              align: "left",
            },
          ];
        });
      }),
    ];
    return () => {
      for (const cb of cleanCbs) {
        cb();
      }
      cleanCbs.length = 0;
    };
  }, [backend]);

  return { messages, input, on, setMessages, isPending };
}
