import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h1`
  color: #6c63ff;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 1rem 0;
  border: 1px solid #6c63ff;
  border-radius: 8px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #6c63ff;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;

  &:hover {
    background-color: #5a52e0;
  }
`;

const SurveyAccess = () => {
  const [accessToken, setAccessToken] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accessToken) {
      // Redirect to the survey using the accessToken
      navigate(`/survey/respond?accessToken=${accessToken}`);
    }
  };

  return (
    <Container>
      <Title>Acessar Enquete</Title>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Insira o token de acesso"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
        />
        <Button type="submit">Acessar Enquete</Button>
      </form>
    </Container>
  );
};

export default SurveyAccess;
