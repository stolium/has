import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { translations } from './translations';

type Locale = 'en' | 'ru';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LOCALE_KEY = 'hunt-locale';

const I18nContext = createContext<I18nContextValue>(null!);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem(LOCALE_KEY);
    return saved === 'ru' ? 'ru' : 'en';
  });

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(LOCALE_KEY, l);
  };

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let value = translations[locale]?.[key];

      // Try stripping copy suffix for cards (e.g., card.tb-5-0.name -> card.tb-5.name)
      if (!value && key.startsWith('card.')) {
        const stripped = key.replace(/-\d+\./, '.');
        value = translations[locale]?.[stripped];
      }

      // Fallback to English
      if (!value) {
        value = translations['en']?.[key];
        if (!value && key.startsWith('card.')) {
          const stripped = key.replace(/-\d+\./, '.');
          value = translations['en']?.[stripped];
        }
      }

      // Final fallback: return the key itself
      if (!value) {
        return key;
      }

      if (params) {
        for (const [k, v] of Object.entries(params)) {
          value = value.replace(`{${k}}`, String(v));
        }
      }
      return value;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
