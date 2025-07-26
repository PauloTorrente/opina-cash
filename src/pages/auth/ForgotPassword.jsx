import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import InputField from '../../components/common/Input/InputField';
import styled from 'styled-components';
import { requestPasswordReset } from '../../services/api';

const FormContainer = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 1.5rem;
  background-color: #fff5f8;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FormTitle = styled.h2`
  text-align: center;
  color: #6c63ff;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const SuccessMessage = styled.p`
  color: #4CAF50;
  text-align: center;
  margin-top: 1rem;
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  text-align: center;
  margin-top: 1rem;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  
  a {
    color: #6c63ff;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await requestPasswordReset(email);
      setSuccess('Se han enviado las instrucciones para restablecer tu contraseña a tu correo electrónico.');
    } catch (err) {
      setError(err.message || 'Ocurrió un error. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Restablecer Contraseña</FormTitle>
      {success && <SuccessMessage>{success}</SuccessMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <InputField
          type="email"
          name="email"
          placeholder="Ingresa tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
        </Button>
      </Form>
      <LoginLink>
        <Link to="/login">Volver al inicio de sesión</Link>
      </LoginLink>
    </FormContainer>
  );
};

export default ForgotPassword;
