import { useTranslation } from 'react-i18next';

function History() {
  const { t } = useTranslation();
  return <span className="text-sm font-bold block mb-2">{t('history')}</span>;
}

export default History;
