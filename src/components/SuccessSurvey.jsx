import React from 'react';
import { 
  ModalOverlay, 
  ModalContent, 
  ModalTitle, 
  ModalText 
} from './Survey.styles';
import Button from './Button';

export const SuccessModal = ({ onClose }) => (
  <ModalOverlay>
    <ModalContent>
      <ModalTitle>¡Encuesta completada!</ModalTitle>
      <ModalText>
        Gracias por participar. Tus respuestas han sido registradas con éxito.
      </ModalText>
      <Button onClick={onClose}>Volver al inicio</Button>
    </ModalContent>
  </ModalOverlay>
);