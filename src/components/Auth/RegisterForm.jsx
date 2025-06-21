import React from 'react';
import styled from 'styled-components';
import InputField from '../common/Input/InputField'; // Importing the InputField component for text fields
import Button from '../common/Button/Button'; // Importing the Button component for the submit button
import LoadingSpinner from '../common/Loader/LoadingSpinner'; // Importing the LoadingSpinner component for loading state
import ErrorDisplay from '../common/ErrorDisplay'; // Importing the ErrorDisplay component to show error messages
import PasswordStrength from '../Auth/PasswordStrength'; // Importing PasswordStrength component to show password strength indicator

// Styled container for the form
const FormContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff5f8;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  // Mobile responsiveness: reduces padding and max-width for smaller screens
  @media (max-width: 480px) {
    padding: 1rem;
    max-width: 90%;
  }
`;

// Styled title for the form
const FormTitle = styled.h2`
  text-align: center;
  color: #6c63ff; // Color for the title text
  margin-bottom: 1.5rem; // Margin at the bottom of the title
`;

// Container for the terms and conditions checkbox
const TermsContainer = styled.div`
  display: flex;
  align-items: center; // Aligning checkbox and link vertically
  justify-content: center; // Centering them horizontally
  margin-top: 1rem;
`;

// Styled checkbox input for terms acceptance
const Checkbox = styled.input`
  margin-right: 8px; // Space between checkbox and text link
`;

// Styled link to terms and conditions
const TermsLink = styled.a`
  font-size: 0.9rem;
  color: #6c63ff; // Link color
  cursor: pointer;
  text-decoration: underline;
`;

// RegisterForm component
const RegisterForm = ({ onSubmit, isLoading, errors, formData, handleChange, handleBlur, fieldErrors, acceptedTerms, setAcceptedTerms }) => {
  return (
    <FormContainer>
      {/* Form title */}
      <FormTitle>Regístrate y comienza a ganar</FormTitle>
      
      {/* Form submission */}
      <form onSubmit={onSubmit}>
        {/* Input fields for first name, last name, email, password, and confirm password */}
        <InputField
          type="text"
          name="firstName"
          placeholder="Nombre *"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          $error={fieldErrors.firstName} // Using transient prop for styling error
        />
        <InputField
          type="text"
          name="lastName"
          placeholder="Apellido *"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          $error={fieldErrors.lastName} // Using transient prop for styling error
        />
        <InputField
          type="email"
          name="email"
          placeholder="Correo electrónico *"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          $error={fieldErrors.email} // Using transient prop for styling error
        />
        <InputField
          type="password"
          name="password"
          placeholder="Contraseña *"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          $error={fieldErrors.password} // Using transient prop for styling error
        />
        <InputField
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña *"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          $error={fieldErrors.confirmPassword} // Using transient prop for styling error
        />
        
        {/* Password strength indicator */}
        <PasswordStrength password={formData.password} />

        {/* Terms and conditions checkbox */}
        <TermsContainer>
          <Checkbox
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={() => setAcceptedTerms(!acceptedTerms)} // Toggle terms acceptance state
          />
          <TermsLink href="/terms" target="_blank">
            Aceptar términos y condiciones
          </TermsLink>
        </TermsContainer>

        {/* Display loading spinner if form is submitting, otherwise show submit button */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Button type="submit" $fullWidth={true}> {/* Using transient prop for styling full width */}
            Registrarse
          </Button>
        )}

        {/* Display any error messages */}
        <ErrorDisplay errors={errors} />
      </form>
    </FormContainer>
  );
};

export default RegisterForm;
