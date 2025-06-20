import { useState } from "react";
import { Button } from "../../dist/button";
import { createOpenAIBackend } from "../../dist/utils/backend";
import { agent } from "../../dist/utils/core";

export function Activate({ onActivate }) {
  const [token, setToken] = useState("");

  const activateChat = () => {
    agent.use(
      createOpenAIBackend({
        apiKey: token,
        baseURL: "https://api.deepseek.com",
        model: "deepseek-chat",
        maxTokens: 200,
        dangerouslyAllowBrowser: true,
      }),
    );
    localStorage.setItem("deepseek-token", token);
    onActivate();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Activate Chat</h1>
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Enter your DeepSeek API Token"
        className="border border-gray-300 p-2 rounded mb-4 w-80"
      />
      <Button
        onClick={activateChat}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Activate Chat
      </Button>
    </div>
  );
}
