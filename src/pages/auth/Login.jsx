import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser } from '../../services/api.js';
import Button from '../../components/common/Button/Button';
import InputField from '../../components/common/Input/InputField';
import styled from 'styled-components';
import AuthContext from '../../context/AuthContext';

// Container principal responsivo
const MainContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.isDesktop ? '#f8f9fa' : '#fff5f8'};
  padding: ${props => props.isDesktop ? '3rem 1rem' : '1rem'};
  box-sizing: border-box;
`;

// Card do formulário
const FormCard = styled.div`
  width: 100%;
  max-width: ${props => props.isDesktop ? '450px' : '100%'};
  background: ${props => props.isDesktop ? 'white' : props.isMobileWithCard ? 'white' : 'transparent'};
  border-radius: ${props => props.isDesktop ? '20px' : props.isMobileWithCard ? '16px' : '0'};
  padding: ${props => props.isDesktop ? '3rem' : props.isMobileWithCard ? '2rem' : '1.5rem'};
  box-shadow: ${props => {
    if (props.isDesktop) return '0 15px 50px rgba(0, 0, 0, 0.12), 0 5px 20px rgba(108, 99, 255, 0.08)';
    if (props.isMobileWithCard) return '0 8px 25px rgba(0, 0, 0, 0.1)';
    return 'none';
  }};
  box-sizing: border-box;
  
  @media (max-width: 480px) {
    padding: ${props => props.isMobileWithCard ? '1.5rem' : '1rem'};
    max-width: ${props => props.isMobileWithCard ? 'calc(100% - 2rem)' : '100%'};
    margin: ${props => props.isMobileWithCard ? '0 auto' : '0'};
  }
  
  @media (min-width: 481px) and (max-width: 767px) {
    max-width: 420px;
    margin: 0 auto;
  }
`;

const FormTitle = styled.h2`
  text-align: center;
  color: #6c63ff;
  margin-bottom: ${props => props.isDesktop ? '2.5rem' : '1.8rem'};
  font-size: ${props => props.isDesktop ? '2.2rem' : '1.8rem'};
  font-weight: ${props => props.isDesktop ? '600' : '500'};
  
  @media (max-width: 480px) {
    font-size: 1.6rem;
    margin-bottom: 1.5rem;
  }
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

const RegisterPrompt = styled.div`
  text-align: center;
  margin-top: ${props => props.isDesktop ? '2rem' : '1.5rem'};
  padding-top: ${props => props.isDesktop ? '1.5rem' : '1rem'};
  border-top: 1px solid #eee;
  color: #666;
  font-size: ${props => props.isDesktop ? '1rem' : '0.95rem'};
  
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
  margin-bottom: 0.5rem;
  
  a {
    color: #6c63ff;
    text-decoration: none;
    font-size: ${props => props.isDesktop ? '1rem' : '0.9rem'};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.isDesktop ? '1.5rem' : '1.2rem'};
  width: 100%;
`;

// Elemento decorativo para desktop
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
    
    svg {
      width: 36px;
      height: 36px;
    }
  }
`;

const Login = () => {
  const location = useLocation();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobileWithCard, setIsMobileWithCard] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Get the redirect location or default to home
  const from = location.state?.from?.pathname || '/';
  const searchParams = location.state?.from?.search || '';

  // Verifica se é desktop baseado no tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024);
      // Em tablets e celulares maiores, usamos card. Em celulares muito pequenos, sem card.
      setIsMobileWithCard(width >= 481 && width < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  // Estilo dos inputs baseado no dispositivo
  const getInputStyle = () => ({
    fontSize: isDesktop ? '1.1rem' : '1rem',
    padding: isDesktop ? '1.1rem 1.3rem' : '0.9rem 1rem',
    borderRadius: isDesktop ? '12px' : '8px'
  });

  return (
    <MainContainer isDesktop={isDesktop}>
      <FormCard isDesktop={isDesktop} isMobileWithCard={isMobileWithCard}>
        <DecorativeIcon isDesktop={isDesktop}>
          <div className="icon-circle">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </DecorativeIcon>
        
        <FormTitle isDesktop={isDesktop}>Iniciar sesión</FormTitle>
        <Form onSubmit={handleSubmit} isDesktop={isDesktop}>
          <InputField
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            required
            style={getInputStyle()}
          />
          <InputField
            type="password"
            name="password"
            placeholder="Contraseña"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
            style={getInputStyle()}
          />
          <ForgotPasswordLink isDesktop={isDesktop}>
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </ForgotPasswordLink>
          <Button 
            type="submit"
            style={{
              padding: isDesktop ? '1.2rem' : '1rem',
              fontSize: isDesktop ? '1.1rem' : '1rem',
              fontWeight: isDesktop ? '600' : '500',
              borderRadius: isDesktop ? '14px' : '10px'
            }}
          >
            Entrar
          </Button>
        </Form>
        {error && <ErrorMessage isDesktop={isDesktop}>{error}</ErrorMessage>}
        
        <RegisterPrompt isDesktop={isDesktop}>
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </RegisterPrompt>
      </FormCard>
    </MainContainer>
  );
};

export default Login;
