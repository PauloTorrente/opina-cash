import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import es from './translations/es';
import ptBR from './translations/pt-BR';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  resolveInitialLanguage,
  storeLanguage,
} from './detectLanguage';

const dictionaries = { es, 'pt-BR': ptBR };

const LanguageContext = createContext(null);

const getByPath = (obj, path) =>
  path.split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), obj);

const interpolate = (str, vars) => {
  if (!vars) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : match
  );
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(resolveInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) return;
    storeLanguage(lang);
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key, vars) => {
      const dict = dictionaries[language] || dictionaries[DEFAULT_LANGUAGE];
      const fallbackDict = dictionaries[DEFAULT_LANGUAGE];
      const value = getByPath(dict, key) ?? getByPath(fallbackDict, key);

      if (value == null) {
        console.warn(`[i18n] Missing translation key: "${key}"`);
        return key;
      }

      return typeof value === 'string' ? interpolate(value, vars) : value;
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useTranslation = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useTranslation must be used within a LanguageProvider');
  return ctx;
};
