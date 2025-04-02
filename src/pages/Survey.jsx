import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { Container, Title, QuestionContainer, QuestionText, Select } from '../components/Survey.styles';
import AuthContext from '../context/AuthContext';

const Survey = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const accessToken = queryParams.get('accessToken');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (!user) {
      navigate('/login', {
        state: { 
          from: location 
        },
        replace: true
      });
    }
  }, [user, navigate, location]);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        if (!user) return; 

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token de autenticação não encontrado');
        }

        const response = await fetch(`https://enova-backend.onrender.com/api/surveys/respond?accessToken=${accessToken}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Error al obtener la encuesta');
        }
        
        const surveyData = await response.json();
        
        if (!surveyData) {
          throw new Error('Encuesta no encontrada');
        }

        let questions = typeof surveyData.questions === 'string' 
          ? JSON.parse(surveyData.questions) 
          : surveyData.questions;

        questions = questions.map((q, index) => {
          if (typeof q === 'string') {
            return {
              questionId: index + 1,
              question: q,
              type: 'text'
            };
          }
          
          const questionId = q.id || q.questionId || index + 1;
          return {
            questionId: questionId,
            id: questionId,
            question: q.question || q.text,
            type: q.type || 'text',
            options: q.options || []
          };
        });

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

    if (accessToken && user) {
      fetchSurvey();
    }
  }, [accessToken, user]);

  const handleResponseChange = (questionId, answer) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!survey?.questions || !user) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const responseData = survey.questions.map(question => {
        return {
          questionId: Number(question.questionId),
          answer: responses[question.questionId] || ''
        };
      }).filter(item => item.answer !== '');

      const response = await fetch(`https://enova-backend.onrender.com/api/surveys/respond?accessToken=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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

  if (!user) return null; 

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
