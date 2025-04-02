import React, { useEffect, useState } from 'react';
import styled from 'styled-components'; 
import { motion } from 'framer-motion';

// Modal overlay styles (background that covers the entire screen)
const ModalOverlay = styled(motion.div)`
  position: fixed; // Fixed position so it stays on the screen
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); // Semi-transparent black background
  display: flex;
  justify-content: center; // Center the modal horizontally
  align-items: center; // Center the modal vertically
  z-index: 1000; // Ensure the modal appears on top of other content
`;

// Modal content styles (the actual modal box)
const ModalContent = styled(motion.div)`
  background: white; // White background for the modal
  padding: 2rem; // Padding inside the modal
  border-radius: 10px; // Rounded corners for the modal
  text-align: center; // Center the text inside the modal
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); // Soft shadow around the modal
  width: 90%; // 90% of the screen width
  max-width: 400px; // Max width of the modal is 400px
  margin: 0 auto; // Center the modal horizontally
`;

// Styled title for the modal
const ModalTitle = styled.h2`
  color: #6c63ff; // Purple color for the title
  margin-bottom: 1rem; // Space below the title
`;

// Styled button inside the modal
const ModalButton = styled.button`
  background-color: #6c63ff; // Purple background color
  color: white; // White text color
  font-size: 1rem; // Font size for the button text
  padding: 0.75rem 1.5rem; // Padding inside the button
  border: none; // No border for the button
  border-radius: 50px; // Rounded corners for the button
  cursor: pointer; // Change cursor to pointer when hovering
  margin-top: 1rem; // Space above the button

  &:hover {
    background-color: #5a52e0; // Darker purple when hovering over the button
  }
`;

// Styled countdown text
const CountdownText = styled.p`
  color: #555; // Gray text color
  font-size: 0.9rem; // Font size for the countdown text
  margin-top: 1rem; // Space above the countdown text
`;

const SuccessModal = ({ onClose }) => {
  const [showButton, setShowButton] = useState(false); // State to track if the button should be shown
  const [countdown, setCountdown] = useState(10); // Countdown state initialized at 10 seconds

  useEffect(() => {
    // Start the 10-second countdown when the component is mounted
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1; // Decrease the countdown
        clearInterval(timer); // Stop the timer when it reaches 0
        setShowButton(true); // Show the button after countdown ends
        return 0; // Set countdown to 0
      });
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup the timer when the component is unmounted
  }, []); // Empty dependency array to run this effect only once

  return (
    <ModalOverlay
      initial={{ opacity: 0 }} // Start with opacity 0 (hidden)
      animate={{ opacity: 1 }} // Fade in the modal
      exit={{ opacity: 0 }} // Fade out the modal when it's closed
    >
      <ModalContent
        initial={{ scale: 0.8 }} // Start with smaller scale
        animate={{ scale: 1 }} // Animate to full size
        exit={{ scale: 0.8 }} // Animate back to smaller scale when closing
      >
        <ModalTitle>¡Registro Exitoso!</ModalTitle> {/* Title of the modal */}
        <p>Por favor, revisa tu correo electrónico para confirmar tu cuenta.</p> {/* Message to the user */}

        {!showButton ? (
          <CountdownText>
            El botón estará disponible en {countdown} segundos...
          </CountdownText> // Show countdown message while waiting
        ) : (
          <ModalButton onClick={onClose}>Ir a la página de login</ModalButton> // Show button to go to login page after countdown
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default SuccessModal; 
