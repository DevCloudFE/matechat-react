import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import "./tailwind.css";

export interface InputCountProps extends React.ComponentProps<"span"> {
  count: number;
  limit: number;
}

export function InputCount({
  count,
  limit,
  className,
  ...props
}: InputCountProps) {
  return (
    <span className={clsx("text-gray-400", className)} {...props}>
      {count} / {limit}
    </span>
  );
}

export interface SenderButtonProps extends React.ComponentProps<"button"> {
  icon?: React.ReactNode;
  isSending?: boolean;
}
export function SenderButton({
  className,
  icon,
  isSending = false,
  ...props
}: SenderButtonProps) {
  return (
    <button
      type="button"
      data-slot="sender-button"
      className={twMerge(
        clsx(
          "flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 hover:bg-blue-500/90 text-white cursor-pointer",
          className,
        ),
      )}
      {...props}
    >
      {icon ?? (
        <span className={clsx("text-white")}>{isSending ? "■" : "→"}</span>
      )}
    </button>
  );
}

export interface SenderProps extends React.ComponentProps<"div"> {
  initialMessage?: string;
  placeholder?: string;
  sendMessage: (message: { text: string }) => void;
  onMessageChange?: (message: string) => void;
  onSend?: () => void;
  toolbar?: React.ReactNode;
  suggestion?: (context: {
    message: string;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    onInject: (text: string, position: number) => void;
  }) => React.ReactNode;
}

export function Sender({
  className,
  initialMessage = "",
  placeholder = "Type your message here...",
  onMessageChange,
  sendMessage,
  onSend,
  toolbar,
  suggestion,
  ...props
}: SenderProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState(initialMessage);
  const [caretPosition, setCaretPosition] = useState<number | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    onMessageChange?.(message);
  }, [message, onMessageChange]);

  useEffect(() => {
    if (textareaRef.current && caretPosition !== null) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = caretPosition;
      textareaRef.current.selectionEnd = caretPosition;
      setCaretPosition(null);
    }
  }, [caretPosition]);

  const handleSend = useCallback(() => {
    if (message.trim() === "") return;
    const trimmedMessage = message.trim();
    setMessage("");
    sendMessage({ text: trimmedMessage });
    onSend?.();
  }, [message, sendMessage, onSend]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (
        event.key === "Enter" &&
        !event.shiftKey &&
        !event.nativeEvent.isComposing
      ) {
        event.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
    },
    [],
  );

  const handleTextInject: (newText: string, newCursorPosition: number) => void =
    useCallback((newText, suggestionStartPosition) => {
      setMessage((prevMessage) => {
        const currentCaretPosition =
          textareaRef.current?.selectionStart ?? prevMessage.length;
        const textBefore = prevMessage.slice(0, suggestionStartPosition);
        const textAfter = prevMessage.slice(currentCaretPosition);
        const newMessage = textBefore + newText + textAfter;
        return newMessage;
      });
      setCaretPosition(suggestionStartPosition + newText.length);
    }, []);

  return (
    <div
      data-slot="sender"
      className={twMerge(
        clsx(
          "relative px-1 flex flex-col items-center border rounded-2xl",
          "border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md",
          "focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500",
          className,
        ),
      )}
      {...props}
    >
      {suggestion?.({
        message,
        textareaRef,
        onInject: handleTextInject,
      })}
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={clsx(
          "w-full pt-4 px-4 border-0 rounded-2xl resize-none! bg-transparent",
          "focus:ring-0 focus:outline-none text-gray-700 placeholder-gray-400",
          "overflow-y-auto max-h-32",
          "scrollbar-gutter-stable [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb]:cursor-auto",
          "[&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600",
          "[&::-webkit-scrollbar-thumb:hover]:bg-gray-400 dark:[&::-webkit-scrollbar-thumb:hover]:bg-gray-500",
          "[&::-webkit-scrollbar-track]:mt-3",
        )}
        rows={2}
      />
      <div className="flex items-center w-full px-4 py-2 gap-4">
        {toolbar}
        <SenderButton onClick={handleSend} className="ml-auto" />
      </div>
    </div>
  );
}
