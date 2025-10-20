import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import InputField from '../../components/common/Input/InputField';
import styled from 'styled-components';
import { resetPassword as resetPasswordService } from '../../services/api';

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

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extraer el token de la cadena de consulta
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Token inválido o expirado.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await resetPasswordService(token, newPassword);
      setSuccess(response.message);
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Ocurrió un error. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Establecer Nueva Contraseña</FormTitle>
      {success && <SuccessMessage>{success}</SuccessMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <InputField
          type="password"
          name="newPassword"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <InputField
          type="password"
          name="confirmPassword"
          placeholder="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={isLoading || !token}>
          {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ResetPassword;
