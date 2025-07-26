import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser } from '../../services/api.js';
import Button from '../../components/common/Button/Button';
import InputField from '../../components/common/Input/InputField';
import styled from 'styled-components';
import AuthContext from '../../context/AuthContext';

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

const ErrorMessage = styled.p`
  color: #ff4d4d;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const RegisterPrompt = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.95rem;
  
  a {
    color: #6c63ff;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ForgotPasswordLink = styled.div`
  text-align: right;
  margin-top: -0.5rem;
  
  a {
    color: #6c63ff;
    text-decoration: none;
    font-size: 0.9rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
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
      <Form onSubmit={handleSubmit}>
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
        <ForgotPasswordLink>
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </ForgotPasswordLink>
        <Button type="submit">Entrar</Button>
      </Form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <RegisterPrompt>
        ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
      </RegisterPrompt>
    </FormContainer>
  );
};

export default Login;
