import clsx from "clsx";
import type React from "react";
import { useCallback } from "react";
import ThemeIcon from "./assets/theme.svg?react";

function ThemeToggle({
  className,
  ...props
}: React.ComponentPropsWithRef<"button">) {
  const toggleTheme = useCallback(() => {
    const docEle = document.documentElement;
    if (docEle.classList.contains("dark")) {
      docEle.classList.remove("dark");
    } else {
      docEle.classList.add("dark");
    }
  }, []);

  return (
    <button
      type="button"
      className={clsx(
        "p-2 bg-transparent hover:bg-white/23 rounded-lg cursor-pointer",
        className,
      )}
      onClick={toggleTheme}
      {...props}
    >
      <ThemeIcon className="size-5 text-gray-800 dark:text-gray-400" />
    </button>
  );
}

export default ThemeToggle;
