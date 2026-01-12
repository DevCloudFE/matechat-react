import "./tailwind.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import type * as React from "react";
import { twMerge } from "tailwind-merge";

const promptsVariants = cva("flex", {
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
});

const promptVariants = cva(
  "flex flex-col justify-center bg-background-elevated border-border hover:border-border/80",
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

const promptTitleVariants = cva("font-medium text-foreground", {
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
});

const promptDescriptionVariants = cva("text-muted-foreground", {
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
});

export function Prompts({
  className,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof promptsVariants>) {
  return (
    <div
      data-slot="prompts"
      className={twMerge(clsx(promptsVariants({ size }), className))}
      {...props}
    />
  );
}

export function Prompt({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof promptVariants>) {
  return (
    <div
      data-slot="prompt"
      data-size={size}
      className={twMerge(clsx(promptVariants({ size, className })))}
      {...props}
    />
  );
}

export function PromptTitle({
  className,
  size,
  ...props
}: React.ComponentProps<"h3"> & VariantProps<typeof promptTitleVariants>) {
  const computedClassName = size
    ? twMerge(clsx(promptTitleVariants({ size, className })))
    : twMerge(
        clsx(
          "font-medium text-foreground",
          "[div[data-size='xs']_&]:text-sm",
          "[div[data-size='sm']_&]:text-base",
          "[div[data-size='default']_&]:text-base",
          "[div[data-size='md']_&]:text-lg",
          "[div[data-size='lg']_&]:text-xl",
          className,
        ),
      );

  return (
    <h3 data-slot="prompt-title" className={computedClassName} {...props} />
  );
}

export function PromptDescription({
  className,
  size,
  ...props
}: React.ComponentProps<"p"> & VariantProps<typeof promptDescriptionVariants>) {
  const computedClassName = size
    ? twMerge(clsx(promptDescriptionVariants({ size, className })))
    : twMerge(
        clsx(
          "text-muted-foreground",
          "[div[data-size='xs']_&]:text-xs",
          "[div[data-size='sm']_&]:text-sm",
          "[div[data-size='default']_&]:text-sm",
          "[div[data-size='md']_&]:text-base",
          "[div[data-size='lg']_&]:text-base",
          className,
        ),
      );

  return (
    <p
      data-slot="prompt-description"
      className={computedClassName}
      {...props}
    />
  );
}
