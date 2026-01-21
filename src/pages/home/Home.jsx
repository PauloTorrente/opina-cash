import React, { useState, useContext, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HeaderContainer, TitleDivider } from '../../components/layout/Header';
import Button from '../../components/common/Button/Button';
import Footer from '../../components/layout/Footer';
import AuthContext from '../../context/AuthContext';
import InfoReminder from '../../components/common/InfoReminder';
import LoginSuccessModal from '../../components/Auth/LoginSuccessModal';
import { useIncompleteProfile } from '../../hooks/useIncompleteProfile';
import logo from '../../assets/images/logo.png';
import '@fontsource/poppins/700.css';
import { 
  Container, 
  Logo, 
  SurveyInfoSection, 
  headerVariants, 
  titleVariants,
  MainTitle,
  SubTitle
} from './Home.styles';

const Home = () => {
  // State management for user choices and UI visibility
  const [userChoice, setUserChoice] = useState(null);
  const [showStartButton, setShowStartButton] = useState(true); 
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [hasShownSuccessModal, setHasShownSuccessModal] = useState(false); 

  // Navigation and authentication hooks
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); 
  const profileStatus = useIncompleteProfile(); 

  // Effect to show success modal when profile is complete after registration
  useEffect(() => {
    if (user && !profileStatus.needsBasicInfo && !hasShownSuccessModal) {
      setShowSuccessModal(true);
      setHasShownSuccessModal(true);
    }
  }, [user, profileStatus.needsBasicInfo, hasShownSuccessModal]);

  // Handles user choice between new/existing account
  const handleChoice = (choice) => {
    setUserChoice(choice);
    navigate(choice === 'new' ? '/register' : '/login');
  };

  // Handles click on main CTA button
  const handleStartNow = () => {
    setShowStartButton(false);
  };

  // Handles closing the success modal
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <Container>
      {/* Shows profile completion reminder if needed, but not when success modal is shown */}
      {user && profileStatus.needsBasicInfo && !showSuccessModal && (
        <InfoReminder missingFields={profileStatus.missingFieldsCount} />
      )}

      {/* Animation wrapper for success modal - has priority over InfoReminder */}
      <AnimatePresence>
        {showSuccessModal && (
          <LoginSuccessModal onClose={handleCloseSuccessModal} />
        )}
      </AnimatePresence>

      {/* Main header section with logo and title */}
      <HeaderContainer variants={headerVariants} initial="hidden" animate="visible">
        <Logo src={logo} alt="Opina Cash Logo" />
        
        <MainTitle 
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
        >
          Donde tu opinión paga
        </MainTitle>
        
        <SubTitle>
          Gana dinero real compartiendo tu opinión
        </SubTitle>
        
        <TitleDivider 
          initial={{ scaleX: 0 }} 
          animate={{ scaleX: 1 }} 
          transition={{ duration: 0.4 }} 
        />
        
        {/* Main CTA button - only shown initially */}
        {showStartButton && (
          <Button 
            onClick={handleStartNow} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Comenzar a ganar"
            style={{
              background: 'linear-gradient( #FF6B00, #FF00A8)',
              color: 'white',
              fontSize: '1.2rem',
              padding: '1rem 2rem',
              borderRadius: '50px',
              boxShadow: '0 4px 15px rgba(255, 107, 0, 0.3)',
              marginTop: '1rem'
            }}
          >
            ¡Empieza a ganar ahora!
          </Button>
        )}
      </HeaderContainer>

      {/* Account type selection - shown after clicking main CTA */}
      {userChoice === null && !showStartButton && (
        <SurveyInfoSection>
          <p>¿Eres nuevo o ya tienes cuenta?</p>
          <Button 
            onClick={() => handleChoice('new')}
            aria-label="Registrarse como nuevo usuario"
            style={{
              background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              margin: '0.5rem'
            }}
          >
            Soy nuevo
          </Button>
          <Button 
            onClick={() => handleChoice('existing')}
            aria-label="Iniciar sesión"
            style={{
              background: 'linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)',
              color: '#333',
              margin: '0.5rem'
            }}
          >
            Ya tengo cuenta
          </Button>
        </SurveyInfoSection>
      )}
      

      {/* Survey information section */}
      <SurveyInfoSection>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
          Responde encuestas desde tu celular en menos de 5 minutos y gana X Euros por cada una.
        </p>
      </SurveyInfoSection>

      {/* Footer component */}
      <Footer />
    </Container>
  );
};

export default Home;
