import { useTranslation } from 'react-i18next';

function Language() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="px-2 py-1.5 bg-transparent hover:bg-white/23 rounded-lg cursor-pointer"
    >
      <span className="inline-block scale-x-105 scale-y-88">
        {i18n.language === 'zh' ? 'EN' : 'CN'}
      </span>
    </button>
  );
}

export default Language;
