import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../../components/common/Modal/SuccessModal';
import RegisterForm from '../../components/Auth/RegisterForm';
import { validateEmail, validatePassword, validateConfirmPassword } from '../../hooks/validations.js';
import { handleRegisterSubmit } from '../../hooks/handleRegisterSubmit.js';
import { useTranslation } from '../../i18n/LanguageContext';

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: '' });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';

    if (name === 'email' && value.trim() !== '' && !validateEmail(value)) {
      errorMessage = t('register.validation.invalidEmail');
    } else if (name === 'password' && value.trim() !== '') {
      errorMessage = validatePassword(value, t); // Retorna a mensagem de erro específica
    } else if (name === 'confirmPassword' && value.trim() !== '') {
      errorMessage = validateConfirmPassword(formData.password, value, t); // Verifica se as senhas coincidem
    } else if ((name === 'firstName' || name === 'lastName') && value.trim() === '') {
      errorMessage = t('register.validation.required');
    }

    setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    const newFieldErrors = {
      firstName: formData.firstName.trim() === '' ? t('register.validation.required') : '',
      lastName: formData.lastName.trim() === '' ? t('register.validation.required') : '',
      email: formData.email.trim() === '' ? t('register.validation.required') : !validateEmail(formData.email) ? t('register.validation.invalidEmail') : '',
      password: formData.password.trim() === '' ? t('register.validation.required') : validatePassword(formData.password, t),
      confirmPassword: formData.confirmPassword.trim() === '' ? t('register.validation.required') : validateConfirmPassword(formData.password, formData.confirmPassword, t),
    };

    setFieldErrors(newFieldErrors);
    // Verifica se há erros nos campos ou se os termos não foram aceitos
    const hasErrors = Object.values(newFieldErrors).some(error => error !== '' && error !== null);
    if (hasErrors || !acceptedTerms) {
      setErrors([t('register.validation.formErrors')]);
      setIsLoading(false);
      return;
    }

    await handleRegisterSubmit(formData, setErrors, setShowSuccessModal, t);
    setIsLoading(false);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <RegisterForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errors={errors}
        formData={formData}
        handleChange={handleChange}
        handleBlur={handleBlur}
        fieldErrors={fieldErrors}
        acceptedTerms={acceptedTerms}
        setAcceptedTerms={setAcceptedTerms}
      />
      {showSuccessModal && <SuccessModal onClose={handleCloseModal} />}
    </motion.div>
  );
};

export default Register;
