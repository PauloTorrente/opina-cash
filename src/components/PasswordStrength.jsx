import React from 'react';
import styled from 'styled-components';

const StrengthBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-top: 0.5rem;
  overflow: hidden;
`;

const StrengthBar = styled.div`
  height: 100%;
  border-radius: 4px;
  background-color: ${(props) => {
    if (props.$strength === 'weak') return '#ff4d4d'; // Vermelho
    if (props.$strength === 'medium') return '#ffa500'; // Laranja
    if (props.$strength === 'strong') return '#28a745'; // Verde
    return '#e0e0e0'; // Cinza (padrão)
  }};
`;

const PasswordRequirements = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #555;
`;

const Requirement = styled.p`
  color: ${(props) => (props.$valid ? '#28a745' : '#ff4d4d')};
  margin: 0.25rem 0;
`;

const PasswordStrength = ({ password }) => {
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  const strength = isLongEnough && hasLetters && hasNumbers && hasSpecialChars ? 'strong' :
                   isLongEnough && (hasLetters || hasNumbers) ? 'medium' : 'weak';

  const width = password.length > 0 ? (password.length / 12) * 100 : 0;

  return (
    <div>
      <StrengthBarContainer>
        <StrengthBar $strength={strength} style={{ width: `${width}%` }} />
      </StrengthBarContainer>

      <PasswordRequirements>
        <Requirement $valid={isLongEnough}>
          {isLongEnough ? '✓ ' : '✗ '}Al menos 8 caracteres
        </Requirement>
        <Requirement $valid={hasLetters}>
          {hasLetters ? '✓ ' : '✗ '}Incluir letras
        </Requirement>
        <Requirement $valid={hasNumbers}>
          {hasNumbers ? '✓ ' : '✗ '}Incluir números
        </Requirement>
        <Requirement $valid={hasSpecialChars}>
          {hasSpecialChars ? '✓ ' : '✗ '}Incluir caracteres especiales (!@#$%^&*)
        </Requirement>
      </PasswordRequirements>
    </div>
  );
};

export default PasswordStrength;
