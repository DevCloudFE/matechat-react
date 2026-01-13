import "./tailwind.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import type * as React from "react";
import { twMerge } from "tailwind-merge";

const promptsVariants = cva("flex", {
  variants: {
    size: {
      xs: "gap-mc-pt-layout-gap-xs",
      sm: "gap-mc-pt-layout-gap-sm",
      default: "gap-mc-pt-layout-gap",
      md: "gap-mc-pt-layout-gap",
      lg: "gap-mc-pt-layout-gap-lg",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const promptVariants = cva(
  "flex flex-col justify-center bg-mc-pt-bg border-mc-pt-brd rounded-mc-pt transition-all duration-mc-pt hover:shadow-mc-pt-el",
  {
    variants: {
      size: {
        xs: "px-mc-pt-px-xs py-mc-pt-py-xs gap-mc-pt-gap-xs",
        sm: "px-mc-pt-px-sm py-mc-pt-py-sm gap-mc-pt-gap-sm",
        default: "px-mc-pt-px py-mc-pt-py gap-mc-pt-gap",
        md: "px-mc-pt-px-md py-mc-pt-py-md gap-mc-pt-gap",
        lg: "px-mc-pt-px-lg py-mc-pt-py-lg gap-mc-pt-gap-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const promptTitleVariants = cva("font-medium text-mc-pt-fg", {
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

const promptDescriptionVariants = cva("text-mc-pt-mut", {
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
          "font-medium text-mc-pt-fg",
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
          "text-mc-pt-mut",
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
