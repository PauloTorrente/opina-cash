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
        // Buscar a pesquisa diretamente pelo endpoint que já filtra pelo token
        const response = await fetch(`https://enova-backend.onrender.com/api/surveys/respond?accessToken=${accessToken}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Error al obtener la encuesta');
        }
        
        const surveyData = await response.json();
        
        if (!surveyData) {
          throw new Error('Encuesta no encontrada');
        }

        // Debug: Mostrar a estrutura completa da survey recebida
        console.log('Survey data received:', surveyData);

        // Parsear las preguntas si es necesario
        let questions = typeof surveyData.questions === 'string' 
          ? JSON.parse(surveyData.questions) 
          : surveyData.questions;

        // Debug: Mostrar as perguntas antes da normalização
        console.log('Questions before normalization:', questions);

        // Normalizar a estrutura das perguntas
        questions = questions.map((q, index) => {
          // Se a pergunta for apenas texto
          if (typeof q === 'string') {
            return {
              questionId: index + 1,
              question: q,
              type: 'text'
            };
          }
          
          // Se já for objeto, garantir a estrutura correta
          const questionId = q.id || q.questionId || index + 1;
          return {
            questionId: questionId,
            id: questionId, // Manter ambos para compatibilidade
            question: q.question || q.text,
            type: q.type || 'text',
            options: q.options || []
          };
        });

        // Debug: Mostrar as perguntas após normalização
        console.log('Questions after normalization:', questions);

        setSurvey({
          ...surveyData,
          questions
        });
      } catch (error) {
        console.error('Error fetching survey:', error);
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
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!survey?.questions) return;

    try {
      // Preparar respostas no formato exato que o backend espera
      const responseData = survey.questions.map(question => {
        return {
          questionId: Number(question.questionId), // Garantir que é número
          answer: responses[question.questionId] || ''
        };
      }).filter(item => item.answer !== '');

      console.log('Submitting responses:', {
        accessToken,
        responses: responseData
      });

      const response = await fetch(`https://enova-backend.onrender.com/api/surveys/respond?accessToken=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(responseData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Error al enviar respuestas');
      }

      alert('¡Respuestas enviadas con éxito!');
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) return <Container>Cargando...</Container>;
  if (error) return <Container>Error: {error}</Container>;
  if (!survey) return <Container>Encuesta no encontrada</Container>;

  return (
    <Container>
      <Title>{survey.title}</Title>
      <form onSubmit={handleSubmit}>
        {survey.questions.map((question) => {
          const questionId = question.questionId;
          
          return (
            <QuestionContainer key={`q-${questionId}`}>
              <QuestionText>{question.question}</QuestionText>
              
              {question.type === 'text' ? (
                <InputField
                  type="text"
                  placeholder="Tu respuesta"
                  value={responses[questionId] || ''}
                  onChange={(e) => handleResponseChange(questionId, e.target.value)}
                />
              ) : (
                <Select
                  value={responses[questionId] || ''}
                  onChange={(e) => handleResponseChange(questionId, e.target.value)}
                >
                  <option value="" disabled>Selecciona una opción</option>
                  {question.options.map((option, i) => (
                    <option key={`opt-${i}`} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              )}
            </QuestionContainer>
          );
        })}
        <Button type="submit">Enviar respuestas</Button>
      </form>
    </Container>
  );
};

export default Survey;
