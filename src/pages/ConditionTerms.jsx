import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const TermsContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff5f8;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #9b5de5;
  margin-bottom: 1.5rem;
`;

const TermsText = styled.p`
  font-size: 1rem;
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  width: 48%;
  padding: 1rem;
  background-color: #f7b7a3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;

  &:hover {
    background-color: #f4a59d;
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
    alert("Debe aceptar los términos y condiciones para continuar.");
  };

  return (
    <TermsContainer>
      <Title>INFORMACIÓN IMPORTANTE</Title>
      <TermsText>
        <strong>Acuerdo de Usuario</strong> ("Acuerdo") regula su acceso y uso de Sondeo Cash ("la Aplicación"), una plataforma diseñada para reclutar y encuestar a individuos para participar en encuestas y recibir pagos por sus respuestas. Al crear una cuenta, acceder o usar la Aplicación, usted acepta cumplir con los términos y condiciones establecidos en este Acuerdo. Si no está de acuerdo, no debe usar la Aplicación.
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
      </TermsText>
    </TermsContainer>
  );
};

export default ConditionTerms;
