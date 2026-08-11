const STORAGE_KEY = 'opinacash.lang';

export const SUPPORTED_LANGUAGES = ['es', 'pt-BR'];
export const DEFAULT_LANGUAGE = 'es';

// Any Portuguese variant (pt, pt-BR, pt-PT...) maps to pt-BR — that's the
// only Portuguese dictionary we ship. Everything else falls back to
// Spanish, which stays the default for the whole site.
const normalize = (tag) => {
  if (!tag) return null;
  const lower = tag.toLowerCase();
  if (lower.startsWith('pt')) return 'pt-BR';
  if (lower.startsWith('es')) return 'es';
  return null;
};

// A user's explicit manual choice (via the language switcher) always wins
// over the browser's language on future visits.
export const getStoredLanguage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(stored) ? stored : null;
  } catch {
    return null;
  }
};

export const storeLanguage = (lang) => {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // localStorage unavailable (private mode, etc.) — nothing to persist.
  }
};

// navigator.languages is the user's ranked preference list; we walk it
// looking for the first tag we recognize before giving up and defaulting.
export const detectBrowserLanguage = () => {
  if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE;

  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const candidate of candidates) {
    const normalized = normalize(candidate);
    if (normalized) return normalized;
  }

  return DEFAULT_LANGUAGE;
};

export const resolveInitialLanguage = () =>
  getStoredLanguage() || detectBrowserLanguage();
