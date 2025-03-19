import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Estilos para a barra de força da senha
const StrengthBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-top: 0.5rem;
  overflow: hidden;
`;

const StrengthBar = styled(motion.div)`
  height: 100%;
  border-radius: 4px;
  background-color: ${(props) => {
    if (props.strength === 'weak') return '#ff4d4d'; // Vermelho
    if (props.strength === 'medium') return '#ffa500'; // Laranja
    if (props.strength === 'strong') return '#28a745'; // Verde
    return '#e0e0e0'; // Cinza (padrão)
  }};
`;

// Função para calcular a força da senha
const calculatePasswordStrength = (password) => {
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  if (isLongEnough && hasLetters && hasNumbers && hasSpecialChars) {
    return 'strong';
  } else if (isLongEnough && (hasLetters || hasNumbers)) {
    return 'medium';
  } else {
    return 'weak';
  }
};

const PasswordStrength = ({ password }) => {
  const strength = calculatePasswordStrength(password);
  const width = password.length > 0 ? (password.length / 12) * 100 : 0; // Ajuste o divisor para controlar a largura máxima

  return (
    <StrengthBarContainer>
      <StrengthBar
        strength={strength}
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 0.3 }}
      />
    </StrengthBarContainer>
  );
};

export default PasswordStrength;