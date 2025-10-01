import { useTranslation } from "react-i18next";
import historyImg from './assets/history.png'
import searchIcon from './assets/search.svg'

function History() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 size-full">
      <span className="text-sm font-bold mb-2">{t("history")}</span>
      <div className="bg-gray-50 h-9 rounded-2xl flex flex-row items-center px-3">
        <img src={searchIcon} alt="search" />
        <input placeholder={t('search')} className="mx-2 text-sm text-gray-600" />
      </div>
      <div className="size-full flex items-center justify-center">
        <img src={historyImg} alt="history" />
      </div>
    </div>
  );
}

export default History;
