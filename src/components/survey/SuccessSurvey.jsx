import React from 'react';
import { ModalOverlay,  ModalContent, ModalTitle, ModalText } from './Survey.styles';
import Button from '../common/Button/Button';

export const SuccessModal = ({ onClose }) => (
  <ModalOverlay>
    <ModalContent>
      <ModalTitle>¡Encuesta completada!</ModalTitle>
      <ModalText>
        Gracias por participar. Ya se va depositar en tu cuenta 70 pesos.
      </ModalText>
      <Button onClick={onClose}>Volver al inicio</Button>
    </ModalContent>
  </ModalOverlay>
);