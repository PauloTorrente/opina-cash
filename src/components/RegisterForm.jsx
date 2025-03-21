import React from 'react';
import styled from 'styled-components';
import InputField from './InputField';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import PasswordStrength from './PasswordStrength';

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

const RegisterForm = ({ onSubmit, isLoading, errors, formData, handleChange, handleBlur, fieldErrors, acceptedTerms, setAcceptedTerms }) => {
  return (
    <FormContainer>
      <FormTitle>Regístrate y comienza a ganar</FormTitle>
      <form onSubmit={onSubmit}>
        <InputField
          type="text"
          name="firstName"
          placeholder="Nombre *"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          $error={fieldErrors.firstName} // Usando transient prop
        />
        <InputField
          type="text"
          name="lastName"
          placeholder="Apellido *"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          $error={fieldErrors.lastName} // Usando transient prop
        />
        <InputField
          type="email"
          name="email"
          placeholder="Correo electrónico *"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          $error={fieldErrors.email} // Usando transient prop
        />
        <InputField
          type="password"
          name="password"
          placeholder="Contraseña *"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          $error={fieldErrors.password} // Usando transient prop
        />
        <InputField
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña *"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          $error={fieldErrors.confirmPassword} // Usando transient prop
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
          <Button type="submit" $fullWidth={true}> {/* Usando transient prop */}
            Registrarse
          </Button>
        )}

        <ErrorDisplay errors={errors} />
      </form>
    </FormContainer>
  );
};

export default RegisterForm;
