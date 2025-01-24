import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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
  border: 1px solid ${props => props.error ? '#f00' : '#6c63ff'};
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
  color: ${props => props.error ? '#f00' : '#6c63ff'};
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

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const [error, setError] = useState('');
  const [formError, setFormError] = useState({
    email: false,
    password: false,
    firstName: false,
    lastName: false,
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormError({ ...formError, [name]: value === '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (Object.values(formError).includes(true) || Object.values(formData).includes('') || !acceptedTerms) {
      setError("Por favor, complete todos los campos obligatorios y acepte los términos y condiciones.");
      return;
    }
    try {
      const response = await axios.post('https://enova-backend.onrender.com/api/auth/register', {
        ...formData,
        role: "user" 
      });
      console.log(response.data);
      navigate('/register-detail');
    } catch (error) {
      console.error(error);
      setError("Error al registrarse, por favor intente nuevamente.");
    }
  };

  const handleNextStep = () => {
    if (Object.values(formError).includes(true) || Object.values(formData).includes('') || !acceptedTerms) {
      setError("Por favor, complete todos los campos obligatorios y acepte los términos y condiciones.");
    } else {
      navigate('/register-detail');
    }
  };

  const handleTermsAccept = () => {
    setAcceptedTerms(!acceptedTerms);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <FormContainer>
        <FormTitle>Registrar</FormTitle>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Correo electrónico *"
            onChange={handleChange}
            value={formData.email}
            error={formError.email}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Contraseña *"
            onChange={handleChange}
            value={formData.password}
            error={formError.password}
            required
          />
          <Input
            type="text"
            name="firstName"
            placeholder="Nombre *"
            onChange={handleChange}
            value={formData.firstName}
            error={formError.firstName}
            required
          />
          <Input
            type="text"
            name="lastName"
            placeholder="Apellido *"
            onChange={handleChange}
            value={formData.lastName}
            error={formError.lastName}
            required
          />
          
          <TermsContainer>
            <Checkbox
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={handleTermsAccept}
            />
            <TermsLink href="/terms" target="_blank">
              Aceptar términos y condiciones
            </TermsLink>
          </TermsContainer>

          <Button type="submit">Registrar</Button>
        </form>
        {error && <Message error>{error}</Message>}
        <Message>
          Puedes completar la información adicional ahora o más tarde.
        </Message>
        <Button onClick={handleNextStep} style={{ backgroundColor: '#6c63ff' }}>
          Completar ahora
        </Button>
      </FormContainer>
    </motion.div>
  );
};

export default Register;
