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
          throw new Error('Error al obtener la encuesta');
        }
        const data = await response.json();

        const surveysArray = Array.isArray(data) ? data : data.surveys || [];
        const surveyWithToken = surveysArray.find(s => s.accessToken === accessToken);

        if (!surveyWithToken) {
          throw new Error('Encuesta no encontrada');
        }

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

    const responseData = Object.keys(responses)
      .filter(questionId => responses[questionId] !== undefined && responses[questionId] !== '')
      .map(questionId => ({
        questionId: Number(questionId),
        answer: responses[questionId],
      }));

    console.log('Enviando respuestas:', JSON.stringify(responseData, null, 2));

    try {
      const response = await fetch(`https://enova-backend.onrender.com/api/surveys/respond?accessToken=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(responseData),
      });

      const responseText = await response.text();
      console.log('Respuesta del servidor:', responseText);

      if (!response.ok) {
        throw new Error(`Error al enviar respuestas: ${responseText}`);
      }

      alert('¡Respuestas enviadas con éxito!');
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <Container>Cargando...</Container>;
  }

  if (error) {
    return <Container>Error: {error}</Container>;
  }

  if (!survey) {
    return <Container>Encuesta no encontrada</Container>;
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
                placeholder="Tu respuesta"
                value={responses[question.questionId] || ''}
                onChange={(e) => handleResponseChange(question.questionId, e.target.value)}
              />
            )}
            {question.type === 'multiple_choice' && (
              <Select
                value={responses[question.questionId] || ''}
                onChange={(e) => handleResponseChange(question.questionId, e.target.value)}
              >
                <option value="" disabled>Selecciona una opción</option>
                {question.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            )}
          </QuestionContainer>
        ))}
        <Button type="submit">Enviar respuestas</Button>
      </form>
    </Container>
  );
};

export default Survey;
