import clsx from "clsx";
import type React from "react";
import { useCallback, useRef } from "react";
import { twMerge } from "tailwind-merge";
import Appendix from "./icons/appendix.svg";

export interface FileUploadProps extends React.ComponentProps<"button"> {
  onFilesSelect?: (files: File[]) => void;
}

export function FileUpload({
  className,
  onFilesSelect,
  ...props
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      onFilesSelect?.(files);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [onFilesSelect],
  );

  return (
    <button
      data-slot="file-upload"
      type="button"
      className={twMerge(
        clsx("cursor-pointer text-mc-fu-fg hover:text-mc-fu-hv", className),
      )}
      onClick={() => fileInputRef.current?.click()}
      {...props}
    >
      <img
        src={Appendix}
        alt="upload"
        className="w-5 h-5 dark:filter dark:filter-invert hover:scale-105"
      />
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleChange}
        multiple
      />
    </button>
  );
}
