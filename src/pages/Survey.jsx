import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { Container, Title, QuestionContainer, QuestionText, Select } from '../components/Survey.styles';

const Survey = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const accessToken = queryParams.get('accessToken');

  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`https://enova-backend.onrender.com/api/surveys/active`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Erro ao buscar a enquete');
        }
        const data = await response.json();

        // Verifica se a resposta é um array ou um objeto
        const surveysArray = Array.isArray(data) ? data : data.surveys || [];

        // Filtra a enquete pelo token
        const surveyWithToken = surveysArray.find(s => s.accessToken === accessToken);

        if (!surveyWithToken) {
          throw new Error('Enquete não encontrada');
        }

        // Verifica se questions já é um objeto ou se precisa ser convertido
        if (typeof surveyWithToken.questions === 'string') {
          surveyWithToken.questions = JSON.parse(surveyWithToken.questions);
        }

        setSurvey(surveyWithToken);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchSurvey();
    }
  }, [accessToken]);

  const handleResponseChange = (questionId, answer) => {
    setResponses({
      ...responses,
      [questionId]: answer,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseData = Object.keys(responses).map(questionId => ({
        questionId: parseInt(questionId),
        answer: responses[questionId],
      }));

      const response = await fetch(`https://enova-backend.onrender.com/api/surveys/respond?accessToken=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(responseData),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar respostas');
      }

      alert('Respostas enviadas com sucesso!');
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <Container>Carregando...</Container>;
  }

  if (error) {
    return <Container>Erro: {error}</Container>;
  }

  if (!survey) {
    return <Container>Enquete não encontrada</Container>;
  }

  return (
    <Container>
      <Title>{survey.title}</Title>
      <form onSubmit={handleSubmit}>
        {survey.questions.map((question) => (
          <QuestionContainer key={question.questionId}>
            <QuestionText>{question.question}</QuestionText>
            {question.type === 'text' && (
              <InputField
                type="text"
                placeholder="Sua resposta"
                value={responses[question.questionId] || ''}
                onChange={(e) => handleResponseChange(question.questionId, e.target.value)}
              />
            )}
            {question.type === 'multiple_choice' && (
              <Select
                value={responses[question.questionId] || ''}
                onChange={(e) => handleResponseChange(question.questionId, e.target.value)}
              >
                <option value="" disabled>Selecione uma opção</option>
                {question.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            )}
          </QuestionContainer>
        ))}
        <Button type="submit">Enviar Respostas</Button>
      </form>
    </Container>
  );
};

export default Survey;
