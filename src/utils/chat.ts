import { useCallback, useEffect, useState } from "react";
import type { InputOptions } from "./backend";
import type {
  Backend,
  Events,
  EventTypes,
  MessageParam,
  Nullable,
} from "./types";

/**
 * Options for `useChat`.
 */
export interface UseChatOptions {
  /**
   * Whether to throw an error when the backend is nullish.
   * @description
   * If `true`, an error will be thrown when the backend is nullish.
   * The error will be thrown when calling `input` or `on` callback,
   * but not thrown immediately.
   * @default false
   */
  throwOnEmptyBackend?: boolean;
}

export interface UseChatReturn {
  messages: MessageParam[];
  input: (prompt: string, options?: InputOptions) => Promise<void>;
  on: <K extends EventTypes["type"]>(
    type: K,
    handler: Events[K],
  ) => Nullable<() => void>;
  setMessages: React.Dispatch<React.SetStateAction<MessageParam[]>>;
  pending: boolean;
}

export function useChat(
  backend?: Backend,
  initialMessages: MessageParam[] = [],
  options: UseChatOptions = {},
): UseChatReturn {
  const [messages, setMessages] = useState<MessageParam[]>(initialMessages);
  const [pending, setPending] = useState(false);

  const input = useCallback(
    async (prompt: string, inputOptions?: InputOptions) => {
      if (!backend && options.throwOnEmptyBackend) {
        throw new Error("Backend is not initialized");
      }
      return backend?.input(prompt, {
        messages,
        ...inputOptions,
      });
    },
    [backend, messages, options.throwOnEmptyBackend],
  );

  const on = useCallback(
    <K extends EventTypes["type"]>(type: K, handler: Events[K]) => {
      if (!backend && options.throwOnEmptyBackend) {
        throw new Error("Backend is not initialized");
      }
      return backend?.on(type, handler);
    },
    [backend, options, options.throwOnEmptyBackend],
  );

  useEffect(() => {
    const cleanCbs: (() => void)[] = backend
      ? [
          backend.on("input", (event) => {
            setPending(true);
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                id: event.id,
                role: "user",
                name: "User",
                content: event.payload.prompt,
                align: "right",
              },
            ]);
          }),
          backend.on("message", (event) => {
            setMessages((prevMessages) => [...prevMessages, event.payload]);
          }),
          backend.on("error", (event) => {
            setPending(false);
            console.error("Error from backend:", event.payload.error);
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                id: event.id,
                role: "system",
                name: "Error",
                content: event.payload.error,
                align: "center",
              },
            ]);
          }),
          backend.on("finish", () => {
            setPending(false);
          }),
          backend.on("chunk", (event) => {
            setPending(false);
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
                  id: event.id,
                  role: "assistant",
                  content: event.payload.chunk,
                  align: "left",
                },
              ];
            });
          }),
        ]
      : [];
    return () => {
      for (const cb of cleanCbs) {
        cb();
      }
      cleanCbs.length = 0;
    };
  }, [backend]);

  return { messages, input, on, setMessages, pending };
}
