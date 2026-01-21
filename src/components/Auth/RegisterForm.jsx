import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import InputField from '../common/Input/InputField';
import Button from '../common/Button/Button';
import LoadingSpinner from '../common/Loader/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import PasswordStrength from '../Auth/PasswordStrength';

// Container principal que se adapta ao dispositivo
const MainContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center; /* SEMPRE centralizado */
  min-height: 100vh; /* SEMPRE ocupa toda a altura */
  background-color: ${props => props.isDesktop ? '#f8f9fa' : '#fff5f8'};
  padding: ${props => props.isDesktop ? '3rem 1rem' : '1rem'};
  box-sizing: border-box;
`;

// Styled container for the form
const FormContainer = styled.div`
  width: 100%;
  max-width: ${props => props.isDesktop ? '650px' : '100%'}; /* Mobile: 100% */
  margin: 0 auto;
  padding: ${props => props.isDesktop ? '3.5rem' : '1.5rem'};
  background-color: white;
  border-radius: ${props => props.isDesktop ? '24px' : '12px'};
  box-shadow: ${props => props.isDesktop 
    ? '0 15px 50px rgba(0, 0, 0, 0.12), 0 5px 20px rgba(108, 99, 255, 0.08)' 
    : '0 4px 15px rgba(0, 0, 0, 0.08)'};
  transition: all 0.3s ease;
  box-sizing: border-box;

  /* Mobile adjustments */
  @media (max-width: 767px) {
    padding: 1.5rem;
    margin: 0 1rem;
    width: calc(100% - 2rem); /* Garante que não fique colado nas bordas */
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    padding: 2.5rem;
    max-width: 600px;
    margin: 0 auto;
  }

  /* Para telas muito pequenas */
  @media (max-width: 360px) {
    padding: 1rem;
    margin: 0 0.5rem;
    width: calc(100% - 1rem);
  }
`;

// Styled title for the form
const FormTitle = styled.h2`
  text-align: center;
  color: #6c63ff;
  margin-bottom: ${props => props.isDesktop ? '2.5rem' : '1.5rem'};
  font-size: ${props => props.isDesktop ? '2.4rem' : '1.6rem'};
  font-weight: ${props => props.isDesktop ? '600' : '500'};
  
  @media (max-width: 767px) {
    font-size: 1.6rem;
    margin-bottom: 1.5rem;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    font-size: 2rem;
  }
`;

const FormSubtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: ${props => props.isDesktop ? '2.5rem' : '1.5rem'};
  font-size: ${props => props.isDesktop ? '1.1rem' : '0.95rem'};
  line-height: 1.5;
  max-width: ${props => props.isDesktop ? '80%' : '100%'};
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 767px) {
    font-size: 0.9rem;
    padding: 0 0.5rem;
  }
`;

// Container para os campos de entrada
const InputsGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.isDesktop ? '1fr 1fr' : '1fr'};
  gap: ${props => props.isDesktop ? '1.5rem' : '1rem'};
  margin-bottom: ${props => props.isDesktop ? '2rem' : '1.5rem'};
  width: 100%;
`;

// Container individual para campos full-width
const FullWidthField = styled.div`
  grid-column: ${props => props.isDesktop ? '1 / -1' : '1'};
  width: 100%;
`;

// Container for the terms and conditions checkbox
const TermsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.isDesktop ? 'flex-start' : 'center'};
  margin: ${props => props.isDesktop ? '2rem 0' : '1rem 0'};
  padding: ${props => props.isDesktop ? '1rem' : '0.8rem'};
  background-color: ${props => props.isDesktop ? '#f8f9ff' : '#f9f9f9'};
  border-radius: ${props => props.isDesktop ? '12px' : '8px'};
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 767px) {
    padding: 0.8rem;
    margin: 1.2rem 0;
  }
`;

// Styled checkbox input for terms acceptance
const Checkbox = styled.input`
  margin-right: 12px;
  min-width: ${props => props.isDesktop ? '20px' : '18px'};
  min-height: ${props => props.isDesktop ? '20px' : '18px'};
  cursor: pointer;
  
  &:checked {
    accent-color: #6c63ff;
  }
`;

// Styled link to terms and conditions
const TermsLink = styled.a`
  font-size: ${props => props.isDesktop ? '1rem' : '0.9rem'};
  color: #6c63ff;
  cursor: pointer;
  text-decoration: none;
  font-weight: ${props => props.isDesktop ? '500' : 'normal'};
  line-height: 1.4;
  word-break: break-word;
  
  &:hover {
    text-decoration: underline;
    color: #5752d4;
  }
`;

// Container para o botão
const ButtonContainer = styled.div`
  margin-top: ${props => props.isDesktop ? '2.5rem' : '1.5rem'};
  width: 100%;
`;

// Decorative elements for desktop
const DecorativeHeader = styled.div`
  display: ${props => props.isDesktop ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  
  .icon-wrapper {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, #6c63ff, #8a84ff);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    box-shadow: 0 8px 25px rgba(108, 99, 255, 0.25);
    
    svg {
      width: 32px;
      height: 32px;
      color: white;
    }
  }
`;

// RegisterForm component
const RegisterForm = ({ onSubmit, isLoading, errors, formData, handleChange, handleBlur, fieldErrors, acceptedTerms, setAcceptedTerms }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  // Verifica se é desktop baseado no tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Função para estilizar inputs baseado no dispositivo
  const getInputStyle = (isDesktop) => ({
    fontSize: isDesktop ? '1.1rem' : '1rem',
    padding: isDesktop ? '1.1rem 1.3rem' : '0.9rem 1rem',
    borderRadius: isDesktop ? '12px' : '8px',
    width: '100%',
    boxSizing: 'border-box'
  });

  return (
    <MainContainer isDesktop={isDesktop}>
      <FormContainer isDesktop={isDesktop}>
        <DecorativeHeader isDesktop={isDesktop}>
          <div className="icon-wrapper">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" fill="white"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="white" strokeWidth="1.5"/>
              <path d="M3 18C3 15.2386 5.23858 13 8 13H16C18.7614 13 21 15.2386 21 18V21H3V18Z" fill="white"/>
              <path d="M3 18C3 15.2386 5.23858 13 8 13H16C18.7614 13 21 15.2386 21 18V21H3V18Z" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
        </DecorativeHeader>
        
        <FormTitle isDesktop={isDesktop}>Regístrate y comienza a ganar</FormTitle>
        
        <FormSubtitle isDesktop={isDesktop}>
          {isDesktop 
            ? 'Crea tu cuenta en pocos pasos y accede a todas nuestras funcionalidades exclusivas' 
            : 'Completa el formulario para crear tu cuenta'}
        </FormSubtitle>
        
        <form onSubmit={onSubmit} style={{ width: '100%' }}>
          <InputsGrid isDesktop={isDesktop}>
            {/* Input fields for first name */}
            <InputField
              type="text"
              name="firstName"
              placeholder="Nombre *"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              $error={fieldErrors.firstName}
              style={getInputStyle(isDesktop)}
            />
            
            {/* Input fields for last name */}
            <InputField
              type="text"
              name="lastName"
              placeholder="Apellido *"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              $error={fieldErrors.lastName}
              style={getInputStyle(isDesktop)}
            />
            
            {/* Input fields for email */}
            <FullWidthField isDesktop={isDesktop}>
              <InputField
                type="email"
                name="email"
                placeholder="Correo electrónico *"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                $error={fieldErrors.email}
                style={getInputStyle(isDesktop)}
              />
            </FullWidthField>
            
            {/* Input fields for password */}
            <FullWidthField isDesktop={isDesktop}>
              <InputField
                type="password"
                name="password"
                placeholder="Contraseña *"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                $error={fieldErrors.password}
                style={getInputStyle(isDesktop)}
              />
            </FullWidthField>
            
            {/* Input fields for confirm password */}
            <FullWidthField isDesktop={isDesktop}>
              <InputField
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña *"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                $error={fieldErrors.confirmPassword}
                style={getInputStyle(isDesktop)}
              />
            </FullWidthField>
          </InputsGrid>
          
          {/* Password strength indicator */}
          <PasswordStrength password={formData.password} />

          {/* Terms and conditions checkbox */}
          <TermsContainer isDesktop={isDesktop}>
            <Checkbox
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              isDesktop={isDesktop}
            />
            <TermsLink 
              href="/terms" 
              target="_blank"
              isDesktop={isDesktop}
            >
              {isDesktop 
                ? 'Acepto los términos y condiciones del servicio' 
                : 'Aceptar términos y condiciones'}
            </TermsLink>
          </TermsContainer>

          {/* Display any error messages */}
          <ErrorDisplay errors={errors} />
          
          {/* Display loading spinner if form is submitting, otherwise show submit button */}
          <ButtonContainer isDesktop={isDesktop}>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <Button 
                type="submit" 
                $fullWidth={true}
                style={{
                  padding: isDesktop ? '1.2rem' : '1rem',
                  fontSize: isDesktop ? '1.1rem' : '1rem',
                  fontWeight: isDesktop ? '600' : '500',
                  borderRadius: isDesktop ? '14px' : '10px',
                  width: '100%'
                }}
              >
                {isDesktop ? 'Crear mi cuenta' : 'Registrarse'}
              </Button>
            )}
          </ButtonContainer>
        </form>
      </FormContainer>
    </MainContainer>
  );
};

export default RegisterForm;
