import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const TermsContainer = styled.div`
  width: 90%;
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: #fff5f8;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #9b5de5;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

const TermsContent = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;
  margin-bottom: 1.5rem;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c9c4e4;
    border-radius: 10px;
  }
`;

const TermsText = styled.p`
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.6;
  text-align: justify;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const Highlight = styled.span`
  background-color: #f0e6ff;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 500;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 0.9rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const AcceptButton = styled(Button)`
  background-color: #6c63ff;
  color: white;

  &:hover {
    background-color: #5a52e0;
  }
`;

const DeclineButton = styled(Button)`
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;

  &:hover {
    background-color: #eaeaea;
  }
`;

const ConditionTerms = () => {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  const handleAccept = () => {
    setAccepted(true);
    navigate('/register');
  };

  const handleDecline = () => {
    alert("Debe aceptar los términos y condiciones para utilizar la aplicación.");
  };

  return (
    <TermsContainer>
      <Title>TÉRMINOS Y CONDICIONES</Title>
      
      <TermsContent>
        <TermsText>
          <strong>Acuerdo de Usuario</strong> ("Acuerdo") regula su acceso y uso de OpinaCash ("la Aplicación"), una plataforma diseñada para reclutar y encuestar a individuos para participar en encuestas y recibir pagos por sus respuestas. Al crear una cuenta, acceder o usar la Aplicación, usted acepta cumplir con los términos y condiciones establecidos en este Acuerdo. Si no está de acuerdo, no debe usar la Aplicación.
          <br /><br />
          
          <strong>Aceptación de los Términos</strong>
          <br />
          1.1. Al registrarse en la Aplicación, usted confirma que tiene al menos 18 años (o la mayoría de edad en su jurisdicción) y que tiene la capacidad legal para aceptar este Acuerdo.
          <br />
          1.2. Usted se compromete a proporcionar información precisa, actual y completa durante el proceso de registro y a actualizar dicha información según sea necesario para garantizar su precisión.
          <br /><br />
          
          <strong>Recolección y Uso de Información Personal</strong>
          <br />
          2.1. Para participar en encuestas, debe proporcionar cierta información demográfica, que puede incluir, entre otros, edad, género, ubicación, nivel de ingresos y estado laboral.
          <br />
          2.2. Toda la información personal que proporcione será recolectada, procesada y almacenada de acuerdo con nuestra Política de Privacidad. Al usar la Aplicación, usted consiente la recolección y uso de sus datos personales con fines como asignar encuestas relevantes y procesar pagos.
          <br /><br />
          
          <strong>Participación en Encuestas</strong>
          <br />
          3.1. La Aplicación presentará encuestas adaptadas a su información demográfica. La participación es voluntaria, y usted puede rechazar o omitir encuestas a su discreción.
          <br />
          3.2. Al enviar sus respuestas, acepta que estas serán evaluadas mediante <Highlight>un sistema de control de calidad</Highlight> para determinar su puntuación. El desempeño en cada encuesta influirá directamente en la cantidad y frecuencia de encuestas futuras asignadas. Las respuestas completas y de calidad incrementarán sus oportunidades de participación. En caso contrario, podrían disminuir o cesar. Cada respuesta será <Highlight>evaluada individualmente</Highlight> según criterios de relevancia y exhaustividad.
        </TermsText>
      </TermsContent>

      <ButtonContainer>
        <DeclineButton onClick={handleDecline}>
          Rechazar
        </DeclineButton>
        <AcceptButton onClick={handleAccept}>
          Aceptar Términos
        </AcceptButton>
      </ButtonContainer>
    </TermsContainer>
  );
};

export default ConditionTerms;
