import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom'; // Para capturar o token da URL

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

const SuccessMessage = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem 3rem;
  text-align: center;
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h2`
  color: ${props => props.success ? '#28a745' : '#dc3545'};
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 2rem;
`;

const CTAButton = styled.button`
  background-color: #28a745;
  color: white;
  font-size: 1rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const RegistrationSuccess = () => {
  const { confirmationToken } = useParams(); // Captura o token da URL
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fazendo a requisição para confirmar o registro
    const confirmRegistration = async () => {
      try {
        const response = await fetch(`https://enova-backend.onrender.com/api/users/confirm/${confirmationToken}`);
        
        if (response.ok) {
          const data = await response.json();
          setSuccess(true);
          setMessage(data.message || "Registro confirmado com sucesso!");
        } else {
          setSuccess(false);
          setMessage("Falha ao confirmar o registro. Tente novamente.");
        }
      } catch (error) {
        setSuccess(false);
        setMessage("Ocorreu um erro. Tente novamente.");
      }
    };

    confirmRegistration();
  }, [confirmationToken]);

  const handleLoginRedirect = () => {
    navigate('/login'); // Redireciona para a página de login
  };

  return (
    <Container>
      <SuccessMessage>
        <Title success={success}>{success ? "¡Registro exitoso!" : "¡Error al confirmar!"}</Title>
        <Subtitle>{message}</Subtitle>
        {success && <CTAButton onClick={handleLoginRedirect}>Iniciar sesión</CTAButton>}
      </SuccessMessage>
    </Container>
  );
};

export default RegistrationSuccess;
