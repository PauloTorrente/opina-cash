import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../services/api';
import Button from '../components/Button';
import InputField from '../components/InputField';
import styled from 'styled-components';
import AuthContext from '../context/AuthContext';

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

const ErrorMessage = styled.p`
  color: #ff4d4d;
  text-align: center;
  margin-top: 1rem;
`;

const Login = () => {
  const location = useLocation();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Get the redirect location or default to home
  const from = location.state?.from?.pathname || '/';
  const searchParams = location.state?.from?.search || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUser(credentials);
      await login(data); // Update auth state
      
      // Redirect to original location or home
      navigate(`${from}${searchParams}`, { replace: true });
    } catch (error) {
      if (error.message === 'The email or password may be incorrect.') {
        setError('El correo electrónico o la contraseña pueden ser incorrectos.');
      } else if (error.message === 'Please confirm your email before logging in.') {
        setError('Por favor, confirma tu correo electrónico antes de iniciar sesión.');
      } else {
        setError('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
      }
    }
  };

  return (
    <FormContainer>
      <FormTitle>Iniciar sesión</FormTitle>
      <form onSubmit={handleSubmit}>
        <InputField
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          required
        />
        <InputField
          type="password"
          name="password"
          placeholder="Contraseña"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
        <Button type="submit">Entrar</Button>
      </form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormContainer>
  );
};

export default Login;
