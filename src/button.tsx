import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import type * as React from "react";
import { twMerge } from "tailwind-merge";

import "./tailwind.css";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors text-white dark:text-white/80",
  {
    variants: {
      variant: {
        default: "bg-blue-500 hover:bg-blue-500/90 gap-1",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2",
        icon: "p-2",
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
      data-slot="button"
      className={twMerge(clsx(buttonVariants({ variant, size, className })))}
      {...props}
    />
  );
}

export { Button };
