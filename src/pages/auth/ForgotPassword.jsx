import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import InputField from '../../components/common/Input/InputField';
import styled from 'styled-components';
import { requestPasswordReset } from '../../services/api';

// Container principal que se adapta ao dispositivo
const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${props => props.isDesktop ? '#f8f9fa' : '#fff5f8'};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => props.isDesktop ? '2rem' : '1rem'};
  box-sizing: border-box;
`;

// Container do formulário com diferentes estilos para PC e mobile
const FormContainer = styled.div`
  background-color: white;
  border-radius: ${props => props.isDesktop ? '20px' : '16px'};
  box-shadow: ${props => props.isDesktop 
    ? '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 20px rgba(108, 99, 255, 0.05)' 
    : '0 4px 12px rgba(0, 0, 0, 0.08)'};
  padding: ${props => props.isDesktop ? '3rem' : '1.5rem'};
  width: 100%;
  max-width: ${props => props.isDesktop ? '500px' : '100%'};
  margin: ${props => props.isDesktop ? '0' : '0 auto'};
  transition: all 0.3s ease;
  
  @media (min-width: 768px) {
    padding: 2.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 3rem;
    max-width: 500px;
  }
`;

const FormTitle = styled.h2`
  text-align: center;
  color: #6c63ff;
  margin-bottom: ${props => props.isDesktop ? '2rem' : '1.5rem'};
  font-size: ${props => props.isDesktop ? '2.2rem' : '1.8rem'};
  font-weight: ${props => props.isDesktop ? '600' : '500'};
  
  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const FormSubtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: ${props => props.isDesktop ? '2.5rem' : '1.5rem'};
  font-size: ${props => props.isDesktop ? '1.1rem' : '0.95rem'};
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.isDesktop ? '1.8rem' : '1.2rem'};
`;

const SuccessMessage = styled.p`
  color: #4CAF50;
  text-align: center;
  margin: ${props => props.isDesktop ? '1.5rem 0' : '1rem 0'};
  padding: ${props => props.isDesktop ? '1rem' : '0.8rem'};
  background-color: rgba(76, 175, 80, 0.1);
  border-radius: 8px;
  font-size: ${props => props.isDesktop ? '1rem' : '0.9rem'};
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  text-align: center;
  margin: ${props => props.isDesktop ? '1.5rem 0' : '1rem 0'};
  padding: ${props => props.isDesktop ? '1rem' : '0.8rem'};
  background-color: rgba(255, 77, 77, 0.1);
  border-radius: 8px;
  font-size: ${props => props.isDesktop ? '1rem' : '0.9rem'};
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: ${props => props.isDesktop ? '2rem' : '1.5rem'};
  padding-top: ${props => props.isDesktop ? '1.5rem' : '1rem'};
  border-top: 1px solid #eee;
  
  a {
    color: #6c63ff;
    text-decoration: none;
    font-weight: 500;
    font-size: ${props => props.isDesktop ? '1rem' : '0.95rem'};
    transition: color 0.2s;
    
    &:hover {
      color: #5752d4;
      text-decoration: underline;
    }
  }
`;

// Ícone decorativo para PC
const DecorativeIcon = styled.div`
  display: ${props => props.isDesktop ? 'flex' : 'none'};
  justify-content: center;
  margin-bottom: 2rem;
  
  .icon-circle {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #6c63ff, #8a84ff);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2rem;
    box-shadow: 0 6px 20px rgba(108, 99, 255, 0.3);
  }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Verifica se é desktop baseado no tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    // Verifica inicialmente
    checkScreenSize();
    
    // Adiciona listener para redimensionamento
    window.addEventListener('resize', checkScreenSize);
    
    // Limpa listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    <MainContainer isDesktop={isDesktop}>
      <FormContainer isDesktop={isDesktop}>
        <DecorativeIcon isDesktop={isDesktop}>
          <div className="icon-circle">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM20 9V7C20 4.79086 18.2091 3 16 3H8C5.79086 3 4 4.79086 4 7V9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </DecorativeIcon>
        
        <FormTitle isDesktop={isDesktop}>Restablecer Contraseña</FormTitle>
        
        <FormSubtitle isDesktop={isDesktop}>
          {isDesktop 
            ? 'Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.' 
            : 'Ingresa tu correo para recibir instrucciones de recuperación.'}
        </FormSubtitle>
        
        {success && <SuccessMessage isDesktop={isDesktop}>{success}</SuccessMessage>}
        {error && <ErrorMessage isDesktop={isDesktop}>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit} isDesktop={isDesktop}>
          <InputField
            type="email"
            name="email"
            placeholder="Ingresa tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              fontSize: isDesktop ? '1.1rem' : '1rem',
              padding: isDesktop ? '1rem 1.2rem' : '0.9rem 1rem'
            }}
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            style={{
              padding: isDesktop ? '1rem' : '0.9rem',
              fontSize: isDesktop ? '1.1rem' : '1rem',
              fontWeight: isDesktop ? '600' : '500'
            }}
          >
            {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
          </Button>
        </Form>
        
        <LoginLink isDesktop={isDesktop}>
          <Link to="/login">← Volver al inicio de sesión</Link>
        </LoginLink>
      </FormContainer>
    </MainContainer>
  );
};

export default ForgotPassword;
