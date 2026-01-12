import "./tailwind.css";

import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import PublishNew from "./icons/publish-new.svg";
import QuickStop from "./icons/quick-stop.svg";
import type { OnTextInject, TriggerConfig } from "./suggestion";
import Suggestion from "./suggestion";
import type { Backend } from "./utils";

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
    <span className={clsx("text-muted", className)} {...props}>
      {count} / {limit}
    </span>
  );
}

export interface SenderButtonProps extends React.ComponentProps<"button"> {
  /**
   * Icon to display in the button.
   *
   * Defaults to a send icon when `isSending` is false,
   * and a stop icon when `isSending` is true. The icon
   * will be overridden if provided.
   */
  icon?: React.ReactNode;
  /**
   * Whether runtime is currently sending a message.
   *
   * If true, the button will display a stop icon
   * instead of the send icon.
   *
   * @default false
   */
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
          "flex items-center justify-center cursor-pointer size-icon-button rounded-full bg-primary text-primary-foreground hover:bg-primary-hover",
          className,
        ),
      )}
      {...props}
    >
      {icon ?? (
        <img
          className="filter brightness-0! invert"
          src={isSending ? QuickStop : PublishNew}
          alt={isSending ? "icon-quick-stop" : "icon-publish-new"}
        />
      )}
    </button>
  );
}

/**
 * Props for the message sender component.
 * @extends React.ComponentProps<"div">
 */
export interface SenderProps extends React.ComponentProps<"div"> {
  /**
   * Initial message to display in the input field.
   * @default ""
   */
  initialMessage?: string;
  /**
   * Placeholder text for the input field.
   * @default "Type your message here..."
   */
  placeholder?: string;
  /**
   * Function to handle input changes.
   */
  input: Backend["input"];
  /**
   * Function to handle message changes.
   * @param message - The new message.
   */
  onMessageChange?: (message: string) => void;
  /**
   * Function to handle the send action.
   * This function is called when the send button is clicked.
   * It receives an AbortController that can be used to abort the request.
   * @param controller - The AbortController to abort the request.
   */
  onSend?: (controller: AbortController) => void;
  toolbar?: React.ReactNode;
  /**
   * Trigger configurations for the suggestion list
   */
  triggerConfigs?: TriggerConfig[];
}

export function Sender({
  className,
  initialMessage = "",
  placeholder = "Type your message here...",
  onMessageChange,
  input,
  onSend,
  toolbar,
  triggerConfigs,
  ...props
}: SenderProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState(initialMessage);
  const [isSending, setIsSending] = useState(false);
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

  const [controller, setController] = useState<AbortController | null>(null);
  const handleSend = useCallback(() => {
    if (isSending) {
      setIsSending(false);
      return controller?.abort();
    }

    if (message.trim() === "") return;
    setIsSending(true);
    const newController = new AbortController();
    setController(newController);
    const maybePromise = input(message, {
      callbacks: {
        onFinish: () => setIsSending(false),
      },
      signal: newController.signal,
    });
    setMessage("");
    if (maybePromise instanceof Promise) {
      maybePromise.then(() => {
        onSend?.(newController);
      });
    } else {
      onSend?.(newController);
    }
  }, [isSending, message, onSend, controller, input]);
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

  const handleTextInject: OnTextInject = useCallback(
    (newText, suggestionStartPosition) => {
      setMessage((prevMessage) => {
        const currentCaretPosition =
          textareaRef.current?.selectionStart ?? prevMessage.length;
        const textBefore = prevMessage.slice(0, suggestionStartPosition);
        const textAfter = prevMessage.slice(currentCaretPosition);
        const newMessage = textBefore + newText + textAfter;
        return newMessage;
      });
      setCaretPosition(suggestionStartPosition + newText.length);
    },
    [],
  );
  return (
    <div
      data-slot="sender"
      className={twMerge(
        clsx(
          "relative px-1 flex flex-col items-center border rounded-xl",
          "border-border shadow-sm transition-all duration-normal hover:shadow-md",
          "focus-within:ring-2 focus-within:ring-ring focus-within:border-primary",
          className,
        ),
      )}
      {...props}
    >
      <div className="absolute bottom-full left-0 w-full bg-background-elevated rounded-lg shadow-elevated max-h-dropdown overflow-y-auto">
        <Suggestion
          message={message}
          textareaRef={textareaRef}
          triggerConfigs={triggerConfigs ?? []}
          onInject={handleTextInject}
        />
      </div>
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={clsx(
          "w-full pt-4 px-4 border-0 rounded-xl resize-none! bg-transparent",
          "focus:ring-0 focus:outline-none text-foreground placeholder-muted",
          "overflow-y-auto max-h-textarea custom-scrollbar", // 关键变化！
        )}
        rows={2}
      />
      <div className="flex items-center w-full px-4 py-2 gap-4">
        {toolbar}
        <SenderButton
          onClick={handleSend}
          isSending={isSending}
          className="ml-auto"
        />
      </div>
    </div>
  );
}
