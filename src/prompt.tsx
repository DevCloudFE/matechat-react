import "./tailwind.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import type * as React from "react";
import { createContext, useContext } from "react";
import { twMerge } from "tailwind-merge";

const PromptContext = createContext<{ size?: "default" | "lg" | "md" | "sm" | "xs" }>({});

const promptsVariants = cva(
  "flex flex-wrap",
  {
    variants: {
      size: {
        xs: "gap-2",
        sm: "gap-3",
        default: "gap-4",
        md: "gap-4",
        lg: "gap-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const promptVariants = cva(
  "flex flex-col justify-center bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-150 cursor-pointer",
  {
    variants: {
      size: {
        xs: "px-3 py-2 gap-1",
        sm: "px-4 py-2.5 gap-1.5",
        default: "px-4 py-3 gap-2",
        md: "px-5 py-3.5 gap-2",
        lg: "px-6 py-4 gap-2.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const promptTitleVariants = cva(
  "font-medium text-gray-900",
  {
    variants: {
      size: {
        xs: "text-sm",
        sm: "text-base",
        default: "text-base",
        md: "text-lg",
        lg: "text-xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const promptDescriptionVariants = cva(
  "text-gray-600",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        default: "text-sm",
        md: "text-base",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export function Prompts({
                          className,
                          size,
                          ...props
                        }: React.ComponentProps<"div"> & VariantProps<typeof promptsVariants>) {
  return (
    <PromptContext.Provider value={{ size: size ?? "default" }}>
      <div
        data-slot="prompts"
        className={twMerge(clsx(promptsVariants({ size }), className))}
        {...props}
      />
    </PromptContext.Provider>
  );
}

export function Prompt({
                         className,
                         size: sizeProp,
                         ...props
                       }: React.ComponentProps<"div"> & VariantProps<typeof promptVariants>) {
  const { size: contextSize } = useContext(PromptContext);
  const size = sizeProp ?? contextSize;

  return (
    <PromptContext.Provider value={{ size }}>
      <div
        data-slot="prompt"
        className={twMerge(clsx(promptVariants({ size, className })))}
        {...props}
      />
    </PromptContext.Provider>
  );
}

export function PromptTitle({
                              className,
                              size: sizeProp,
                              ...props
                            }: React.ComponentProps<"h3"> & VariantProps<typeof promptTitleVariants>) {
  const { size: contextSize } = useContext(PromptContext);
  const size = sizeProp ?? contextSize;

  return (
    <h3
      data-slot="prompt-title"
      className={twMerge(clsx(promptTitleVariants({ size, className })))}
      {...props}
    />
  );
}

export function PromptDescription({
                                    className,
                                    size: sizeProp,
                                    ...props
                                  }: React.ComponentProps<"p"> & VariantProps<typeof promptDescriptionVariants>) {
  const { size: contextSize } = useContext(PromptContext);
  const size = sizeProp ?? contextSize;

  return (
    <p
      data-slot="prompt-description"
      className={twMerge(clsx(promptDescriptionVariants({ size, className })))}
      {...props}
    />
  );
}
