import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HeaderContainer, Title, TitleDivider, Subtitle } from '../components/Header';
import Button from '../components/Button';
import Footer from '../components/Footer';
import AuthContext from '../context/AuthContext';
import InfoReminder from '../components/InfoReminder';
import LoginSuccessModal from '../components/LoginSuccessModal';
import { useIncompleteProfile } from '../hooks/useIncompleteProfile';
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const profileStatus = useIncompleteProfile();

  // Debug épico estilo Matrix
  useEffect(() => {
    console.log("%c⚡⚡⚡ DEBUG EPICO ACTIVADO ⚡⚡⚡", 
      "color: #00ff00; font-size: 16px; font-weight: bold;");
    console.log("%c🧙‍♂️ Estado Mágico:", "color: #4cc9f0; font-weight: bold", {
      userChoice,
      showStartButton,
      showSuccessModal,
      user: user ? "✅ Logado" : "❌ Não logado",
      profileStatus
    });

    if (user) {
      console.log("%c📊 DETALHES DO USUÁRIO:", "color: #f8961e; font-weight: bold");
      console.table({
        '📱 Telefone': user.phone_number || "❌ Não preenchido",
        '🏙️ Cidade': user.city || "❌ Não preenchido",
        '👤 Nome Completo': `${user.first_name || ""} ${user.last_name || ""}`.trim() || "❌ Não preenchido",
        '🎯 Perfil Completo': !profileStatus.needsBasicInfo ? "✅ SIM" : "❌ NÃO"
      });

      const missingFields = [
        'first_name', 'last_name', 'gender', 'age', 
        'city', 'residential_area', 'purchase_responsibility',
        'education_level', 'phone_number'
      ].filter(field => !user[field] || (typeof user[field] === 'string' && user[field].trim() === ''));

      console.log("%c🔍 CAMPOS FALTANTES:", "color: #f94144; font-weight: bold", missingFields);
      
      if (missingFields.length > 0) {
        console.log(`%c⚠️ Faltam ${missingFields.length} campos!`, "color: #f94144; font-size: 14px;");
      } else {
        console.log("%c🎉 PERFIL COMPLETO! Modal deve aparecer!", "color: #43aa8b; font-size: 16px;");
      }
    }
  }, [user, profileStatus, showSuccessModal]);

  const handleChoice = (choice) => {
    console.log(`%c🔄 Navegação: ${choice === 'new' ? '/register' : '/login'}`, 
      "color: #90e0ef; font-weight: bold");
    setUserChoice(choice);
    navigate(choice === 'new' ? '/register' : '/login');
  };

  const handleStartNow = () => {
    console.log("%c🚀 Botão 'Empieza a ganar ahora' clicado!", "color: #ffbe0b; font-weight: bold");
    setShowStartButton(false);
  };

  // Mostrar modal de sucesso quando o perfil estiver completo
  useEffect(() => {
    if (user && !profileStatus.needsBasicInfo) {
      console.log("%c🌈 Mostrando modal de sucesso!", "color: #b5179e; font-size: 14px;");
      setShowSuccessModal(true);
    } else {
      console.log("%c🌑 Escondendo modal (perfil incompleto)", "color: #6c757d; font-size: 12px;");
      setShowSuccessModal(false);
    }
  }, [user, profileStatus.needsBasicInfo]);

  return (
    <Container>
      {/* Mostrar lembrete se o perfil estiver incompleto */}
      {user && profileStatus.needsBasicInfo && (
        <InfoReminder missingFields={profileStatus.missingFieldsCount} />
      )}

      {/* Mostrar modal de sucesso quando o perfil estiver completo */}
      <AnimatePresence>
        {showSuccessModal && (
          <LoginSuccessModal onClose={() => setShowSuccessModal(false)} />
        )}
      </AnimatePresence>

      <HeaderContainer variants={headerVariants} initial="hidden" animate="visible">
        <Logo src={logo} alt="Opina Cash Logo" />
        <Title variants={titleVariants} initial="hidden" animate="visible">
          Bienvenido a Opina Cash
        </Title>
        <TitleDivider 
          initial={{ scaleX: 0 }} 
          animate={{ scaleX: 1 }} 
          transition={{ duration: 0.4 }} 
        />
        <Subtitle>Donde tu opinión paga</Subtitle>
        {showStartButton && (
          <Button 
            onClick={handleStartNow} 
            whileHover={{ scale: 1.03 }}
            aria-label="Comenzar a ganar"
          >
            Empieza a ganar ahora
          </Button>
        )}
      </HeaderContainer>

      {userChoice === null && !showStartButton && (
        <SurveyInfoSection>
          <p>¿Eres nuevo o ya tienes cuenta?</p>
          <Button 
            onClick={() => handleChoice('new')}
            aria-label="Registrarse como nuevo usuario"
          >
            Soy nuevo
          </Button>
          <Button 
            onClick={() => handleChoice('existing')}
            aria-label="Iniciar sesión"
          >
            Ya tengo cuenta
          </Button>
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
