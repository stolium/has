import { useI18n } from '../i18n/context';

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'ru' : 'en')}
      className="text-xs text-slate-400 bg-slate-800 border border-slate-700 px-2 py-1 rounded hover:bg-slate-700 transition font-mono"
    >
      {locale === 'en' ? 'RU' : 'EN'}
    </button>
  );
}
