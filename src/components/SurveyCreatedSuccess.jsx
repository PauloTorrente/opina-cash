import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  padding: 2rem;
  text-align: center;
`;

const SuccessTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #28a745;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
`;

const CopyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const LinkInput = styled.input`
  width: 80%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  text-align: center;
  background-color: #f9f9f9;
`;

const CopyButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: #007bff;
  border: none;
  color: #fff;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const SurveyCreatedSuccess = ({ survey, accessToken }) => {
  const link = `https://www.opinacash.com/survey/respond?accessToken=${accessToken}`;
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopySuccess('¡Copiado!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  return (
    <Container as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SuccessTitle>¡Encuesta creada con éxito!</SuccessTitle>
      <Message>
        La encuesta <strong>{survey.title}</strong> ha sido creada correctamente.
      </Message>
      <CopyContainer>
        <LinkInput type="text" value={link} readOnly />
        <CopyButton onClick={handleCopy}>Copiar</CopyButton>
      </CopyContainer>
      {copySuccess && <p>{copySuccess}</p>}
    </Container>
  );
};

export default SurveyCreatedSuccess;
