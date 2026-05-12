import { cva, type VariantProps } from "class-variance-authority";
import "../tailwind.css";

import type { UIMessage } from "ai";
import clsx from "clsx";
import type React from "react";
import { memo, useCallback, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { twMerge } from "tailwind-merge";
import { BlockQuote, CodeBlock, Heading, Link } from "./markdown";

const bubbleVariants = cva(
  "flex flex-col gap-1 justify-center rounded-lg dark:text-gray-200 text-gray-800 max-w-full whitespace-pre-wrap break-words",
  {
    variants: {
      size: {
        default: "px-4 py-2",
        lg: "px-6 py-3 text-lg",
        md: "px-4 py-2 text-base",
        sm: "px-3 py-1 text-sm",
        xs: "px-2 py-1 text-xs",
      },
      align: {
        left: "self-start",
        center: "self-center",
        right: "self-end",
      },
      background: {
        transparent: "bg-transparent",
        solid: "bg-gray-100 dark:bg-gray-800",
      },
    },
    defaultVariants: {
      size: "default",
      align: "left",
    },
  },
);

export interface BubbleProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof bubbleVariants> {
  text: string;
  background?: "transparent" | "solid";
  pending?: React.ReactNode;
  isPending?: boolean;
}

export function Bubble({
  className,
  text,
  size,
  align,
  background = "solid",
  pending,
  isPending = false,
  ...props
}: BubbleProps) {
  const defaultPending = (
    <div className="flex items-center space-x-1 py-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
      <div
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.1s" }}
      />
      <div
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      />
    </div>
  );

  return (
    <div
      data-slot="bubble"
      className={twMerge(
        clsx(
          bubbleVariants({
            className,
            size,
            align,
            background,
          }),
          pending && "flex items-center",
        ),
      )}
      {...props}
    >
      {isPending ? (
        pending || defaultPending
      ) : (
        <Markdown
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            a: Link,
            code: CodeBlock,
            blockquote: BlockQuote,
            h1: (p) => <Heading {...p} level={1} />,
            h2: (p) => <Heading {...p} level={2} />,
            h3: (p) => <Heading {...p} level={3} />,
            h4: (p) => <Heading {...p} level={4} />,
            h5: (p) => <Heading {...p} level={5} />,
            h6: (p) => <Heading {...p} level={6} />,
          }}
        >
          {text}
        </Markdown>
      )}
    </div>
  );
}

export interface AvatarProps extends React.ComponentProps<"div"> {
  text?: string;
  imageUrl?: string;
}

export function Avatar({ className, text, imageUrl, ...props }: AvatarProps) {
  return (
    <div
      data-slot="avatar"
      className={twMerge(
        clsx(
          "flex items-center justify-center w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-800 dark:text-gray-200 text-gray-800",
          className,
        ),
      )}
      {...props}
    >
      {imageUrl ? (
        <img
          className="w-full h-full object-cover rounded-full"
          src={imageUrl}
          alt={text}
        />
      ) : (
        text
      )}
    </div>
  );
}

function getTextFromParts(parts: UIMessage["parts"]): string {
  return parts
    .filter(
      (part): part is { type: "text"; text: string } => part.type === "text",
    )
    .map((part) => part.text)
    .join("");
}

function getAlignFromRole(role: UIMessage["role"]): "left" | "right" {
  return role === "user" ? "right" : "left";
}

function isAvatarProps(obj: unknown): obj is AvatarProps {
  return (
    typeof obj === "object" &&
    obj !== null &&
    ("text" in obj || "imageUrl" in obj)
  );
}

function getAvatarFromMetadata(
  metadata: UIMessage["metadata"],
): AvatarProps | string | undefined {
  if (!metadata || typeof metadata !== "object") {
    return undefined;
  }
  if (!("avatar" in metadata)) {
    return undefined;
  }
  const avatar = metadata.avatar;
  if (typeof avatar === "string") {
    return avatar;
  }
  if (isAvatarProps(avatar)) {
    return avatar;
  }
  return undefined;
}

export interface BubbleListProps extends React.ComponentProps<"div"> {
  messages: UIMessage[];
  background?: "transparent" | "solid" | "left-solid" | "right-solid";
  isPending?: boolean;
  assistant?: {
    avatar?: AvatarProps;
    align?: "left" | "right";
  };
  footer?: React.ReactNode;
  pending?: React.ReactNode;
  threshold?: number;
}

export const BubbleList = memo(function BubbleList({
  className,
  background = "right-solid",
  footer,
  pending,
  assistant,
  isPending = true,
  messages,
  threshold = 8,
  ...props
}: BubbleListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const pauseScroll = useRef<boolean>(false);
  const contentRect = useRef<DOMRect>(new DOMRect());

  const scrollContainer = useCallback((smooth?: boolean) => {
    if (pauseScroll.current) return;

    requestAnimationFrame(() => {
      containerRef.current?.scrollTo({
        top: containerRef.current?.scrollHeight,
        behavior: smooth ? "smooth" : "instant",
      });
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { height, width } = entry.contentRect;
        if (
          Math.abs(contentRect.current.height - height) > threshold ||
          Math.abs(contentRect.current.width - width) > threshold
        ) {
          contentRect.current = entry.contentRect;
          scrollContainer();
        }
      }
    });

    observer.observe(containerRef.current);
    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [scrollContainer, threshold]);

  const isScrollAtBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;

    return (
      Math.abs(
        container.scrollTop + container.clientHeight - container.scrollHeight,
      ) < threshold
    );
  }, [threshold]);

  const handleWheel = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isScrollAtBottom()) {
      pauseScroll.current = false;
    } else {
      pauseScroll.current = true;
    }
  }, [isScrollAtBottom]);

  const handleTouchStart = useCallback(() => {
    pauseScroll.current = true;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (isScrollAtBottom()) {
      pauseScroll.current = false;
      scrollContainer(false);
    } else {
      pauseScroll.current = true;
    }
  }, [isScrollAtBottom, scrollContainer]);

  const handleTouchMove = useCallback(() => {
    pauseScroll.current = true;
  }, []);

  return (
    <div
      data-slot="bubble-list"
      className={twMerge(
        clsx("flex flex-col overflow-y-auto flex-1 gap-4", className),
      )}
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      {...props}
    >
      <div
        data-slot="bubble-items"
        className="flex flex-col max-w-full flex-1 gap-4"
        ref={contentRef}
      >
        {messages.map((message) => {
          const text = getTextFromParts(message.parts);
          const align = getAlignFromRole(message.role);
          const avatar = getAvatarFromMetadata(message.metadata);

          return (
            <div
              key={message.id}
              data-slot="bubble-item"
              className={twMerge(
                clsx(
                  "flex items-start gap-2",
                  align === "right" && "flex-row-reverse",
                ),
              )}
            >
              {avatar && (
                <Avatar
                  className="shrink-0"
                  {...(typeof avatar === "string"
                    ? { imageUrl: avatar }
                    : avatar)}
                />
              )}
              <Bubble
                text={text}
                align={align}
                background={
                  (background === "left-solid" && align === "left") ||
                  (background === "right-solid" && align === "right") ||
                  background === "solid"
                    ? "solid"
                    : "transparent"
                }
              />
            </div>
          );
        })}
        {isPending && (
          <div
            key="pending"
            data-slot="bubble-item"
            className={twMerge(
              clsx(assistant?.align === "right" && "flex-row-reverse"),
              "flex items-start gap-2 w-full",
            )}
          >
            <Avatar className="shrink-0" {...(assistant?.avatar || {})} />
            <Bubble
              isPending={isPending}
              pending={pending}
              text=""
              align={assistant?.align || "left"}
              background={
                (background === "left-solid" &&
                  (assistant?.align || "left") === "left") ||
                (background === "right-solid" &&
                  (assistant?.align || "left") === "right") ||
                background === "solid"
                  ? "solid"
                  : "transparent"
              }
            />
          </div>
        )}
      </div>
      {footer && (
        <div
          data-slot="bubble-footer"
          className="flex items-center justify-center mt-4"
        >
          {footer}
        </div>
      )}
    </div>
  );
});
