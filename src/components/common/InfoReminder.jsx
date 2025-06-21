import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaGift } from 'react-icons/fa';

const ReminderOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(15, 23, 42, 0.85); // mesmo fundo da home
  z-index: 998;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReminderCard = styled(motion.div)`
  background-color: #1e293b;
  color: #ffffff;
  padding: 2.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  text-align: center;
  width: 90%;
  max-width: 420px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #334155;
    transform: scale(1.03);
  }

  h3 {
    margin: 0.5rem 0;
    font-size: 1.4rem;
  }

  p {
    color: #94a3b8;
    font-size: 1rem;
    margin-top: 0.5rem;
  }

  .icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #facc15;
    animation: bounce 1.5s infinite;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }
`;

export default function InfoReminder() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/profile');
  };

  return (
    <ReminderOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ReminderCard
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
        onClick={handleClick}
      >
        <FaGift className="icon" />
        <h3>¡Gana 7 pesos ahora!</h3>
        <p>Haz clic aquí para completar tu perfil y recibir tu recompensa 🎉</p>
      </ReminderCard>
    </ReminderOverlay>
  );
}
