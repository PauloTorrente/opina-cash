import axios from 'axios';

// `t` is the translation function from useTranslation() — this is a plain
// function (not a component/hook), so the caller must pass it in explicitly.
export const handleRegisterSubmit = async (formData, setErrors, setShowSuccessModal, t) => {
  try {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors([t('register.submitErrors.passwordMismatch')]); // Show error if passwords don't match
      return;
    }

    // Send POST request to register the user
    const response = await axios.post('https://enova-backend.onrender.com/api/auth/register', {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: "user", // Default role is user
    });
    setShowSuccessModal(true); // Show success modal on successful registration
  } catch (error) {
    console.error('Error during registration:', error.response ? error.response.data : error); // Log error if any
    if (error.response) {
      const { status, data } = error.response;

      // Handle different error responses based on status and message
      if (status === 409 && data.message === 'Email is already registered') {
        setErrors([t('register.submitErrors.emailTaken')]); // Show error if email is already registered
      } else if (status === 400 && data.message === 'Invalid email format') {
        setErrors([t('register.submitErrors.invalidEmailFormat')]); // Show error for invalid email format
      } else if (status === 400 && data.message === 'Password must be at least 8 characters') {
        setErrors([t('register.submitErrors.passwordTooShort')]); // Show error for short password
      } else {
        setErrors([data.message || t('register.submitErrors.genericServer')]); // Show generic error message
      }
    } else if (error.request) {
      setErrors([t('register.submitErrors.noConnection')]); // Show error if no response from server
    } else {
      setErrors([t('register.submitErrors.unexpected')]); // Show generic unexpected error message
    }
  }
};
