import clsx from "clsx";
import { useCallback, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  oneLight,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "./hooks";

export interface HeadingProps extends React.ComponentProps<"h1"> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

const headingVariant = {
  1: "text-2xl font-bold my-3",
  2: "text-xl font-bold my-2",
  3: "text-lg font-bold my-1",
  4: "text-md font-bold my-1",
  5: "text-base font-bold",
  6: "text-base font-bold",
};

export function Heading({ children, className, ...rest }: HeadingProps) {
  const { level } = rest;
  return (
    <h1 {...rest} className={clsx(headingVariant[level], className)}>
      {children}
    </h1>
  );
}

export interface CodeBlockProps extends React.ComponentProps<"code"> { }

export function CodeBlock({
  children,
  className,
  ref: _ref,
  ...rest
}: CodeBlockProps) {
  const { isDark } = useTheme();
  const match = /language-(\w+)/.exec(className || "");

  const [copied, setCopied] = useState<boolean>(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);
  console.log(isDark);

  return match ? (
    <div
      className={clsx(
        "w-full overflow-x-auto rounded-lg",
        "bg-gray-50 dark:bg-gray-800",
      )}
    >
      <div className="inline-flex w-full justify-between bg-gray-100 p-2">
        <div className="px-2 py-1 text-xs text-gray-900 dark:text-gray-400">
          {match[1]}
        </div>
        <button
          type="button"
          className="px-2 py-1 text-xs text-gray-900 dark:text-gray-400 cursor-pointer"
          onClick={handleCopy}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        {...rest}
        PreTag="div"
        language={match[1]}
        style={isDark ? vscDarkPlus : oneLight}
        customStyle={{
          background: "transparent",
          margin: 0,
          padding: "1rem",
          borderRadius: "0.5rem",
          overflowX: "auto",
        }}
        codeTagProps={{
          style: {
            fontFamily: "monospace",
            fontSize: "0.875rem",
          },
        }}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code
      {...rest}
      className={clsx(
        "rounded-md px-1 py-0.5 text-[85%]",
        "bg-gray-100 dark:bg-gray-800",
      )}
    >
      {children}
    </code>
  );
}

export interface BlockQuoteProps extends React.ComponentProps<"blockquote"> { }

export function BlockQuote({ children, className, ...rest }: BlockQuoteProps) {
  return (
    <blockquote
      {...rest}
      className={clsx("border-l-4 border-gray-300 pl-4 italic", className)}
    >
      {children}
    </blockquote>
  );
}

export interface LinkProps extends React.ComponentProps<"a"> { }

export function Link({ children, className, ...rest }: LinkProps) {
  return (
    <a
      className={clsx(
        "text-blue-600 dark:text-blue-400 hover:underline underline-offset-1",
        className,
      )}
      target="_blank"
      {...rest}
    >
      {children}
    </a>
  );
}
