import "./tailwind.css";

import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import type * as React from "react";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-mc-btn text-sm font-medium transition-colors text-mc-btn-fg",
  {
    variants: {
      variant: {
        default: "bg-mc-btn hover:bg-mc-btn-hv gap-mc-btn-gap",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "px-mc-btn-px py-mc-btn-py",
        icon: "p-mc-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="mc-btn"
      className={twMerge(clsx(buttonVariants({ variant, size, className })))}
      {...props}
    />
  );
}

export { Button };
