import clsx from "clsx";
import type React from "react";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";

export interface FileUploadProps extends React.ComponentProps<"button"> {
  onFilesSelect: (files: File[]) => void;
}

export function FileUpload({
  className,
  onFilesSelect,
  ...props
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    onFilesSelect(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <button
      type="button"
      className={twMerge(
        clsx("cursor-pointer text-gray-500 hover:text-gray-500/80", className),
      )}
      onClick={() => fileInputRef.current?.click()}
      {...props}
    >
      下载
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
