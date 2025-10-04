import "./tailwind.css";

import { createOpenAIBackend } from "@matechat/react/utils/backend";
import { agent } from "@matechat/react/utils/core";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import chatIcon from "./assets/chat.svg";
import mcLogo from "./assets/logo.svg";
import Communicate from "./communicate";
import History from "./history";
import Language from "./language";
import Settings from "./settings";
import ThemeToggle from "./theme";

function App() {
  const { t } = useTranslation();

  agent.use(
    createOpenAIBackend({
      apiKey: "token",
      baseURL: "https://api.deepseek.com",
      model: "deepseek-chat",
      maxTokens: 200,
      dangerouslyAllowBrowser: true,
    }),
  );

  return (
    <div
      className={clsx(
        "min-h-screen bg-gradient-to-b",
        "from-blue-300 via-pink-100 via-10% to-violet-300",
        "dark:from-[#865f77] dark:via-[#133b5c] dark:via-80% dark:to-[#091e35]",
      )}
    >
      <div className="flex h-screen py-2 pr-2">
        <div className="flex shrink-0 flex-col justify-between w-15 bg-transparent">
          <div className="flex flex-col gap-0.5">
            <div className="flex flex-col items-center mt-2 gap-1.5">
              <img alt="MateChat logo" className="w-9 h-9" src={mcLogo} />
              <span className="text-[10px] font-bold dark:text-gray-200">MateChat</span>
            </div>
            <hr className="w-7/13 mx-auto my-4 border-gray-400 dark:border-gray-300" />
            <div className="flex flex-col items-center gap-1.5 cursor-pointer">
              <img
                alt="Chat icon"
                className="bg-white dark:bg-pink-200/20 p-1.5 rounded-lg shadow-[3px_3px_8px_rgb(0,0,0,0.1)]"
                src={chatIcon}
              />
              <span className="text-xs dark:text-gray-200">{t("chat")}</span>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-4 mb-3.5">
            <Language />
            <ThemeToggle />
            <Settings />
          </div>
        </div>
        <div className="flex flex-row size-full">
          <div
            className={clsx(
              "w-1/4 p-3 rounded-l-xl min-w-[240px] max-w-[380px]",
              "bg-gradient-to-b from-gray-100/80 from-10% to-violet-100/80",
              "dark:bg-none dark:bg-slate-900/40",
            )}
          >
            <History />
          </div>
          <div
            className={clsx(
              "flex-1 rounded-r-xl",
              "bg-gradient-to-b from-[#fffffff2] to-[#f8fafff2]",
              "dark:bg-none dark:bg-black/35",
            )}
          >
            <Communicate />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;