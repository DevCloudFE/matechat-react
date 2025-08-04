import "./tailwind.css";

import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import PublishNew from "./icons/publish-new.svg";
import QuickStop from "./icons/quick-stop.svg";
import type { Backend } from "./utils";

export interface InputCountProps extends React.ComponentProps<"span"> {
  count: number;
  limit: number;
  className: string;
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
          "flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 hover:bg-blue-500/90 text-white",
          className,
        ),
      )}
      {...props}
    >
      {icon ?? (
        <img
          className="filter brightness-0 invert"
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
}
export function Sender({
  className,
  initialMessage = "",
  placeholder = "Type your message here...",
  onMessageChange,
  input,
  onSend,
  toolbar,
  ...props
}: SenderProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState(initialMessage);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    onMessageChange?.(message);
  }, [message, onMessageChange]);

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

  return (
    <div
      data-slot="sender"
      className={twMerge(
        clsx(
          "flex flex-col items-center border border-gray-200 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500",
          className,
        ),
      )}
      {...props}
    >
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pt-4 px-4 border-0 rounded-2xl resize-none focus:ring-0 focus:outline-none text-gray-700 placeholder-gray-400"
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
