export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password) => {
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  if (!isLongEnough) return 'La contraseña debe tener al menos 8 caracteres.';
  if (!hasLetters) return 'La contraseña debe incluir letras.';
  if (!hasNumbers) return 'La contraseña debe incluir números.';
  if (!hasSpecialChars) return 'La contraseña debe incluir caracteres especiales (!@#$%^&*).';

  return null; // Retorna null se a senha for válida
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) return 'Las contraseñas no coinciden.';
  return null;
};
