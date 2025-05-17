import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiCheckCircle, FiClock, FiArrowRight } from 'react-icons/fi';
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalButton,
  CountdownText,
  IconWrapper,
  InfoCard
} from './SuccessModal.styles';

const SuccessModal = ({ onClose }) => {
  const [showButton, setShowButton] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;
        clearInterval(timer);
        setShowButton(true);
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <ModalContent
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <IconWrapper
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FiMail size={40} />
        </IconWrapper>

        <ModalTitle>Confirma tu correo electrónico</ModalTitle>
        
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
          Hemos enviado un enlace de confirmación a tu email
        </p>

        <InfoCard
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>
            <FiCheckCircle color="#10b981" size={18} />
            <span>Busca en tu bandeja de entrada o spam</span>
          </p>
          <p>
            <FiCheckCircle color="#10b981" size={18} />
            <span>Haz clic en el enlace de confirmación</span>
          </p>
          <p>
            <FiCheckCircle color="#10b981" size={18} />
            <span>Tu cuenta se activará automáticamente</span>
          </p>
        </InfoCard>

        {!showButton ? (
          <CountdownText
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
          >
            <FiClock size={16} />
            El botón aparecerá en {countdown}s
          </CountdownText>
        ) : (
          <ModalButton 
            onClick={onClose}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Continuar <FiArrowRight />
          </ModalButton>
        )}

        <motion.p 
          style={{ 
            marginTop: '1.5rem', 
            fontSize: '0.8rem', 
            color: '#94a3b8',
            opacity: 0.7
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5 }}
        >
          ¿No recibiste el email? Revisa tu carpeta de spam o solicita otro.
        </motion.p>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SuccessModal;