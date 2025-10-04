import { BubbleList, FileUpload } from "@matechat/react";
import { InputCount, Sender } from "@matechat/react/sender";
import { useChat, useMateChat } from "@matechat/react/utils/index";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import mcLogo from "./assets/logo.svg";
import clsx from "clsx";

function Communicate() {
  const { t } = useTranslation();

  const { backend } = useMateChat();
  const { messages, input, pending } = useChat(backend, [], {
    throwOnEmptyBackend: true,
  });

  const [prompt, setPrompt] = useState("");
  const handleInputChange = (value: string) => {
    setPrompt(value);
  };

  return (
    <div className="size-full flex flex-col pt-5 px-4 pb-2 items-center">
      <div className="size-full max-w-3xl flex flex-col gap-3 items-center">
        <div className="flex-grow w-full relative">
          <BubbleList
            className="size-full max-w-full"
            messages={messages}
            isPending={pending}
          />
          {messages.length === 0 && (
            <div className="absolute inset-0 flex flex-col justify-center items-center gap-5">
              <div className="flex flex-row items-center gap-1.5">
                <img alt="MateChat logo" className="w-15 h-15" src={mcLogo} />
                <span className="text-3xl font-bold dark:text-gray-200">MateChat</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-200">{t("tip")}</span>
            </div>
          )}
        </div>
        <Sender
          className={clsx(
            "w-full",
            "focus-within:border-[#a18dc2] focus-within:ring-2 focus-within:ring-[#a694c2]",
            "dark:focus-within:border-[#7a6994] dark:focus-within:ring-2 dark:focus-within:ring-[#706385]"
          )}
          placeholder={t("placeholder")}
          input={input}
          onMessageChange={handleInputChange}
          toolbar={
            <div className="flex flex-row justify-between w-full">
              <InputCount count={prompt.length} limit={2000} />
              <FileUpload />
            </div>
          }
        />
        <div className="flex flex-row">
          <span className="text-[12px] text-gray-500">{t("attention")}</span>
          <hr className="h-4 w-px bg-gray-300 dark:bg-gray-600 border-0 mx-2" />
          <span className="text-[12px] text-gray-500 hover:text-gray-550 underline cursor-pointer">
            {t("privacy")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Communicate;
