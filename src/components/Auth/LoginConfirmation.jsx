import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import logo from '../assets/logo.png';

const FullScreenOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

const Logo = styled.img`
  width: 120px;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  color: #6c63ff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

const Message = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  margin-bottom: 2rem;

  p {
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
`;

const WhatsappIcon = styled.div`
  font-size: 4rem;
  color: #25D366;
  margin: 1.5rem 0;
`;

const ContinueButton = styled.button`
  background-color: #6c63ff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #574bff;
    transform: translateY(-2px);
  }
`;

const LoginConfirmation = () => {
  const { user } = useContext(AuthContext);

  return (
    <AnimatePresence>
      {user && (
        <FullScreenOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Logo src={logo} alt="Opina Cash" />
          <Title>¡Bienvenido de vuelta!</Title>
          
          <Message>
            <WhatsappIcon>
              <i className="fab fa-whatsapp"></i>
            </WhatsappIcon>
            <p>Tu sesión ha sido reconocida con éxito.</p>
            <p>Estamos preparando tus próximas encuestas.</p>
            <p>Recibirás notificaciones por WhatsApp cuando estén disponibles.</p>
          </Message>

          <ContinueButton onClick={() => window.location.reload()}>
            Continuar al Dashboard
          </ContinueButton>
        </FullScreenOverlay>
      )}
    </AnimatePresence>
  );
};

export default LoginConfirmation;