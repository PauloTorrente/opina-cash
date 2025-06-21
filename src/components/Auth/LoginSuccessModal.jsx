import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(248, 249, 250, 0.95);
  z-index: 998;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Box = styled(motion.div)`
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  text-align: center;
`;

const WhatsappIcon = styled.div`
  font-size: 4rem;
  color: #25D366;
  margin: 1rem 0;
`;

const LoginSuccessModal = () => {
  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <WhatsappIcon>
          <i className="fab fa-whatsapp"></i>
        </WhatsappIcon>
        <h3>¡Cuenta reconocida con éxito!</h3>
        <p>Pronto recibirás encuestas por WhatsApp.</p>
      </Box>
    </Overlay>
  );
};

export default LoginSuccessModal;
