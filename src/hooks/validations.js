export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// `t` is the translation function from useTranslation() — these are plain
// functions (not components/hooks), so callers must pass it in explicitly.
export const validatePassword = (password, t) => {
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  if (!isLongEnough) return t('register.validation.passwordTooShort');
  if (!hasLetters) return t('register.validation.passwordNeedsLetters');
  if (!hasNumbers) return t('register.validation.passwordNeedsNumbers');
  if (!hasSpecialChars) return t('register.validation.passwordNeedsSpecial');

  return null; // Retorna null se a senha for válida
};

export const validateConfirmPassword = (password, confirmPassword, t) => {
  if (password !== confirmPassword) return t('register.validation.passwordMismatch');
  return null;
};
