import { useTranslation } from "react-i18next";
import historyImg from "./assets/history.png";
import SearchIcon from "./assets/search.svg?react";

function History() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 size-full">
      <span className="text-sm font-bold mb-2 dark:text-gray-200">
        {t("history")}
      </span>
      <div className="bg-gray-50 dark:bg-pink-200/20 h-9 rounded-2xl flex flex-row items-center px-3">
        <SearchIcon className="text-gray-500 dark:text-gray-200" />
        <input
          placeholder={t("search")}
          className="focus:outline-none mx-2 text-sm text-gray-800 dark:text-gray-200"
        />
      </div>
      <div className="size-full flex items-center justify-center">
        <img src={historyImg} alt="history" />
      </div>
    </div>
  );
}

export default History;
