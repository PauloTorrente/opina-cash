import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png'; 
import { useNavigate } from 'react-router-dom';

// Styled Components
const Container = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Arial', sans-serif;
`;

const Header = styled(motion.header)`
  text-align: center;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  color: #6c63ff;
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #555;
  margin-bottom: 2rem;
`;

const Logo = styled.img`
  width: 150px;  // Ajuste do tamanho da logo
  margin-bottom: 2rem;
`;

const CTAButton = styled(motion.button)`
  background-color: #6c63ff;
  color: white;
  font-size: 1.2rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const SurveyInfoSection = styled.section`
  max-width: 800px;
  padding: 3rem 2rem;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  border-radius: 8px;
  text-align: center;
`;

const SurveyInfoTitle = styled.h2`
  color: #333;
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const SurveyInfoText = styled.p`
  font-size: 1.1rem;
  color: #777;
  margin-bottom: 2rem;
`;

const Footer = styled.footer`
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
  width: 100%;
`;

const FooterText = styled.p`
  font-size: 1rem;
  color: #aaa;
`;

// Animations for Framer Motion
const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const ctaButtonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { delay: 0.5, duration: 0.6 } },
};

const Home = () => {
  const [userChoice, setUserChoice] = useState(null);
  const [showStartButton, setShowStartButton] = useState(true);  // Estado para controlar visibilidade do botão
  const navigate = useNavigate();

  const handleChoice = (choice) => {
    setUserChoice(choice);
    if (choice === "new") {
      navigate('/register'); // Redireciona para a página de registro
    } else {
      navigate('/login'); // Redireciona para a página de login
    }
  };

  const handleStartNow = () => {
    setShowStartButton(false);  // Oculta o botão "Comienza ahora" após ser clicado
    setUserChoice(null);         // Reseta o estado do usuário para exibir as opções
  };

  return (
    <Container>
      {/* Header Section */}
      <Header variants={headerVariants} initial="hidden" animate="visible">
        <Logo src={logo} alt="Enova Pulse Logo" />
        <Title>Bienvenido a Opina Cash</Title>
        <Subtitle>Tu solución para encuestas rápidas y automatizadas</Subtitle>
        {showStartButton && (
          <CTAButton variants={ctaButtonVariants} whileHover={{ scale: 1.05 }} onClick={handleStartNow}>
            Comienza ahora
          </CTAButton>
        )}
      </Header>

      {/* Pergunta para escolher entre novo ou já registrado */}
      {userChoice === null && !showStartButton && (
        <SurveyInfoSection>
          <SurveyInfoTitle>¿Eres nuevo o ya tienes cuenta?</SurveyInfoTitle>
          <CTAButton onClick={() => handleChoice('new')}>Soy nuevo</CTAButton>
          <CTAButton onClick={() => handleChoice('existing')}>Ya tengo cuenta</CTAButton>
        </SurveyInfoSection>
      )}

      {/* Survey Info Section */}
      <SurveyInfoSection>
        <SurveyInfoTitle>¿Por qué elegir Enova Pulse?</SurveyInfoTitle>
        <SurveyInfoText>
          Nuestra plataforma te permite crear encuestas dirigidas a tu audiencia en menos de 10 minutos. Nos encargamos de la distribución, procesamiento y recompensas, para que puedas enfocarte en lo que realmente importa: los conocimientos y el crecimiento.
        </SurveyInfoText>
        <CTAButton whileHover={{ scale: 1.05 }}>Aprende más</CTAButton>
      </SurveyInfoSection>

      {/* Footer Section */}
      <Footer>
        <FooterText>&copy; 2025 Enova Pulse - Todos los derechos reservados</FooterText>
      </Footer>
    </Container>
  );
};

export default Home;
