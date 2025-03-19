import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal';
import InputField from '../components/InputField';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import PasswordStrength from '../components/PasswordStrength';

// Styled components
const FormContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff5f8;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    padding: 1rem;
    max-width: 90%;
  }
`;

const FormTitle = styled.h2`
  text-align: center;
  color: #6c63ff;
  margin-bottom: 1.5rem;
`;

const TermsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

const TermsLink = styled.a`
  font-size: 0.9rem;
  color: #6c63ff;
  cursor: pointer;
  text-decoration: underline;
`;

// Funções de validação
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => {
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;
  return isLongEnough && hasLetters && hasNumbers && hasSpecialChars;
};

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
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
    } else if (name === 'password' && value.trim() !== '' && !validatePassword(value)) {
      errorMessage = 'La contraseña debe tener al menos 8 caracteres, incluir letras, números y caracteres especiales.';
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
      password: formData.password.trim() === '' ? 'Este campo es obligatorio.' : !validatePassword(formData.password) ? 'La contraseña debe tener al menos 8 caracteres, incluir letras, números y caracteres especiales.' : '',
    };

    setFieldErrors(newFieldErrors);

    if (Object.values(newFieldErrors).some(error => error !== '') || !acceptedTerms) {
      setErrors(["Por favor, corrige los errores en el formulario y acepta los términos y condiciones."]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://enova-backend.onrender.com/api/auth/register', {
        ...formData,
        role: "user",
      });
      console.log('Registro exitoso:', response.data);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error en el registro:', error.response ? error.response.data : error);
      if (error.response && error.response.data.message === 'Email is already registered') {
        setErrors(['Este correo electrónico ya está registrado.']);
      } else {
        setErrors([error.response?.data.message || "Error al conectar con el servidor. Por favor, intenta de nuevo más tarde."]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <FormContainer>
        <FormTitle>Regístrate y comienza a ganar</FormTitle>
        <form onSubmit={handleSubmit}>
          <InputField
            type="text"
            name="firstName"
            placeholder="Nombre *"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={fieldErrors.firstName}
          />
          <InputField
            type="text"
            name="lastName"
            placeholder="Apellido *"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={fieldErrors.lastName}
          />
          <InputField
            type="email"
            name="email"
            placeholder="Correo electrónico *"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={fieldErrors.email}
          />
          <InputField
            type="password"
            name="password"
            placeholder="Contraseña *"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={fieldErrors.password}
          />
          <PasswordStrength password={formData.password} />

          <TermsContainer>
            <Checkbox
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
            />
            <TermsLink href="/terms" target="_blank">
              Aceptar términos y condiciones
            </TermsLink>
          </TermsContainer>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Button type="submit" fullWidth>
              Registrarse
            </Button>
          )}

          <ErrorDisplay errors={errors} />
        </form>
      </FormContainer>

      {showSuccessModal && <SuccessModal onClose={handleCloseModal} />}
    </motion.div>
  );
};

export default Register;
