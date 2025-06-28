import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Message } from '../../components/survey/Survey.styles.jsx';

const SurveyAlreadyResponded = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => navigate('/'), 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container>
      <Title>¡Ya participaste en esta encuesta!</Title>
      <Message>
        Agradecemos tu colaboración. Serás redirigido automáticamente en 10 segundos...
      </Message>
      <div style={{ marginTop: '20px', fontSize: '1.5rem' }}>
        ⏱️ Redireccionando...
      </div>
    </Container>
  );
};

export default SurveyAlreadyResponded;
