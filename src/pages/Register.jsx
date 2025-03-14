import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal'; 

// Styled components
const FormContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff5f8;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  text-align: center;
  color: #6c63ff;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid ${props => (props.error ? '#f00' : '#6c63ff')};
  border-radius: 8px;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  margin-top: 1.5rem;
  background-color: #f7b7a3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;

  &:hover {
    background-color: #f4a59d;
  }
`;

const Message = styled.p`
  text-align: center;
  color: ${props => (props.error ? '#f00' : '#6c63ff')};
  font-size: 1rem;
  margin-top: 1rem;
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

// Validation functions
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password.length >= 6;

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Estado para controlar o modal
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const newFieldErrors = {
      firstName: formData.firstName.trim() === '' ? 'Este campo es obligatorio.' : '',
      lastName: formData.lastName.trim() === '' ? 'Este campo es obligatorio.' : '',
      email: formData.email.trim() === '' ? 'Este campo es obligatorio.' : !validateEmail(formData.email) ? 'Correo electrónico inválido.' : '',
      password: formData.password.trim() === '' ? 'Este campo es obligatorio.' : !validatePassword(formData.password) ? 'La contraseña debe tener al menos 6 caracteres.' : '',
    };

    setFieldErrors(newFieldErrors);

    if (Object.values(newFieldErrors).some(error => error !== '') || !acceptedTerms) {
      setError("Por favor, corrige los errores en el formulario y acepta los términos y condiciones.");
      return;
    }

    try {
      const response = await axios.post('https://enova-backend.onrender.com/api/auth/register', {
        ...formData,
        role: "user",
      });
      console.log('Registro exitoso:', response.data);
      setShowSuccessModal(true); // Mostra o modal de sucesso
    } catch (error) {
      console.error('Error en el registro:', error.response ? error.response.data : error);
      if (error.response && error.response.data.message === 'Email is already registered') {
        setFieldErrors({ ...fieldErrors, email: 'Este correo electrónico ya está registrado.' });
      } else {
        setError(error.response?.data.message || "Error al conectar con el servidor. Por favor, intenta de nuevo más tarde.");
      }
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false); // Fecha o modal
    navigate('/'); // Redireciona para a página inicial
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <FormContainer>
        <FormTitle>Regístrate y comienza a ganar</FormTitle>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="firstName"
            placeholder="Nombre *"
            onChange={handleChange}
            value={formData.firstName}
            error={fieldErrors.firstName !== ''}
          />
          {fieldErrors.firstName && <Message error>{fieldErrors.firstName}</Message>}

          <Input
            type="text"
            name="lastName"
            placeholder="Apellido *"
            onChange={handleChange}
            value={formData.lastName}
            error={fieldErrors.lastName !== ''}
          />
          {fieldErrors.lastName && <Message error>{fieldErrors.lastName}</Message>}

          <Input
            type="email"
            name="email"
            placeholder="Correo electrónico *"
            onChange={handleChange}
            value={formData.email}
            error={fieldErrors.email !== ''}
          />
          {fieldErrors.email && <Message error>{fieldErrors.email}</Message>}

          <Input
            type="password"
            name="password"
            placeholder="Contraseña *"
            onChange={handleChange}
            value={formData.password}
            error={fieldErrors.password !== ''}
          />
          {fieldErrors.password && <Message error>{fieldErrors.password}</Message>}

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

          <Button type="submit">Registrarse</Button>
          <Message>Puedes completar la información adicional más tarde.</Message>
        </form>
        {error && <Message error>{error}</Message>}
      </FormContainer>

      {/* Modal de sucesso */}
      {showSuccessModal && <SuccessModal onClose={handleCloseModal} />}
    </motion.div>
  );
};

export default Register;
