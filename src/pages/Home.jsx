import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HeaderContainer, Title, TitleDivider, Subtitle } from '../components/Header';
import Button from '../components/Button';
import Footer from '../components/Footer';
import AuthContext from '../context/AuthContext';
import logo from '../assets/logo.png';
import '@fontsource/poppins/700.css';

const Container = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Arial', sans-serif;
  padding: 1rem;
  position: relative;
`;

const Logo = styled.img`
  width: 120px;
  margin-bottom: 1.5rem;
  @media (min-width: 768px) {
    width: 160px;
  }
`;

const SurveyInfoSection = styled.section`
  width: 100%;
  padding: 1.5rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  border-radius: 8px;
  text-align: center;
`;

const LoginConfirmationOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(248, 249, 250, 0.95);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ConfirmationBox = styled(motion.div)`
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

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const titleVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const Home = () => {
  const [userChoice, setUserChoice] = useState(null);
  const [showStartButton, setShowStartButton] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleChoice = (choice) => {
    setUserChoice(choice);
    navigate(choice === "new" ? '/register' : '/login');
  };

  const handleStartNow = () => setShowStartButton(false);

  return (
    <Container>
      <AnimatePresence>
        {user && (
          <LoginConfirmationOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ConfirmationBox
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <WhatsappIcon>
                <i className="fab fa-whatsapp"></i>
              </WhatsappIcon>
              <h3>¡Cuenta reconocida con éxito!</h3>
              <p>Tu sesión ha sido verificada correctamente.</p>
              <p>Pronto recibirás encuestas por WhatsApp.</p>
            </ConfirmationBox>
          </LoginConfirmationOverlay>
        )}
      </AnimatePresence>

      <HeaderContainer variants={headerVariants} initial="hidden" animate="visible">
        <Logo src={logo} alt="Opina Cash Logo" />
        <Title variants={titleVariants} initial="hidden" animate="visible">
          Bienvenido a Opina Cash
        </Title>
        <TitleDivider initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4 }} />
        <Subtitle>Donde tu opinión paga</Subtitle>
        {showStartButton && (
          <Button onClick={handleStartNow} whileHover={{ scale: 1.03 }}>
            Empieza a ganar ahora
          </Button>
        )}
      </HeaderContainer>

      {userChoice === null && !showStartButton && (
        <SurveyInfoSection>
          <p>¿Eres nuevo o ya tienes cuenta?</p>
          <Button onClick={() => handleChoice('new')}>Soy nuevo</Button>
          <Button onClick={() => handleChoice('existing')}>Ya tengo cuenta</Button>
        </SurveyInfoSection>
      )}

      <SurveyInfoSection>
        <p>Responde encuestas desde tu celular en menos de 5 minutos y gana 7 pesos por cada una.</p>
      </SurveyInfoSection>

      <Footer />
    </Container>
  );
};

export default Home;