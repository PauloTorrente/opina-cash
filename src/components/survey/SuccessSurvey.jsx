import React from 'react';
import { ModalOverlay, ModalContent, ModalIcon, ModalTitle, ModalText, ModalButton } from './Survey.styles';

export const SuccessModal = ({ onClose }) => (
  <ModalOverlay>
    <ModalContent>
      <ModalIcon>🎉</ModalIcon>
      <ModalTitle>Pesquisa concluída!</ModalTitle>
      <ModalText>
        Obrigado por participar. Sua recompensa já foi processada e em breve aparecerá na sua conta.
      </ModalText>
      <ModalButton onClick={onClose}>Voltar ao início</ModalButton>
    </ModalContent>
  </ModalOverlay>
);
