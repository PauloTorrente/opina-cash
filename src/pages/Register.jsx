import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal';
import RegisterForm from '../components/RegisterForm';
import { validateEmail, validatePassword, validateConfirmPassword } from '../hooks/validations';
import { handleRegisterSubmit } from '../hooks/handleRegisterSubmit';

const Register = () => {
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
      errorMessage = 'Correo electrónico inválido.';
    } else if (name === 'password' && value.trim() !== '') {
      errorMessage = validatePassword(value); // Retorna a mensagem de erro específica
    } else if (name === 'confirmPassword' && value.trim() !== '') {
      errorMessage = validateConfirmPassword(formData.password, value); // Verifica se as senhas coincidem
    } else if ((name === 'firstName' || name === 'lastName') && value.trim() === '') {
      errorMessage = 'Este campo es obligatorio.';
    }

    setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    const newFieldErrors = {
      firstName: formData.firstName.trim() === '' ? 'Este campo es obligatorio.' : '',
      lastName: formData.lastName.trim() === '' ? 'Este campo es obligatorio.' : '',
      email: formData.email.trim() === '' ? 'Este campo es obligatorio.' : !validateEmail(formData.email) ? 'Correo electrónico inválido.' : '',
      password: formData.password.trim() === '' ? 'Este campo es obligatorio.' : validatePassword(formData.password),
      confirmPassword: formData.confirmPassword.trim() === '' ? 'Este campo es obligatorio.' : validateConfirmPassword(formData.password, formData.confirmPassword),
    };

    setFieldErrors(newFieldErrors);

    console.log('Field Errors:', newFieldErrors); // Debug
    console.log('Accepted Terms:', acceptedTerms); // Debug

    // Verifica se há erros nos campos ou se os termos não foram aceitos
    const hasErrors = Object.values(newFieldErrors).some(error => error !== '' && error !== null);
    if (hasErrors || !acceptedTerms) {
      setErrors(["Por favor, corrige los errores en el formulario y acepta los términos y condiciones."]);
      setIsLoading(false);
      return;
    }

    await handleRegisterSubmit(formData, setErrors, setShowSuccessModal);
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
