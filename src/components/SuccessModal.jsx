import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  margin: 0 auto;
`;

const ModalTitle = styled.h2`
  color: #6c63ff;
  margin-bottom: 1rem;
`;

const ModalButton = styled.button`
  background-color: #6c63ff;
  color: white;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #5a52e0;
  }
`;

const CountdownText = styled.p`
  color: #555;
  font-size: 0.9rem;
  margin-top: 1rem;
`;

const SuccessModal = ({ onClose }) => {
  const [showButton, setShowButton] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Inicia o contador de 10 segundos
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;
        clearInterval(timer); // Para o contador quando chegar a 0
        setShowButton(true); // Mostra o botão após 10 segundos
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer); // Limpa o timer ao desmontar o componente
  }, []);

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalContent
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <ModalTitle>¡Registro Exitoso!</ModalTitle>
        <p>Por favor, revisa tu correo electrónico para confirmar tu cuenta.</p>

        {!showButton ? (
          <CountdownText>
            El botón estará disponible en {countdown} segundos...
          </CountdownText>
        ) : (
          <ModalButton onClick={onClose}>Ir a la página de login</ModalButton>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default SuccessModal;
