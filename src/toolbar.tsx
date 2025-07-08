import type React from "react";
import { useState } from "react";
import { FileUpload } from "./file-upload";

const Toolbar: React.FC = () => {
  const [, setCustomTools] = useState<React.ReactNode[]>([]);

  const addCustomTool = (tool: React.ReactNode) => {
    setCustomTools((prev) => [tool, ...prev]);
  };

  const handleAddCustomTool = () => {
    addCustomTool(
      <FileUpload
        key={`upload-${Date.now()}`}
        onFilesSelect={(files) => console.log("上传文件:", files)}
      />,
    );
  };

  return (
    <div className="flex space-x-2">
      <button
        type="button"
        onClick={handleAddCustomTool}
        className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
      >
        添加
      </button>
    </div>
  );
};

export default Toolbar;

