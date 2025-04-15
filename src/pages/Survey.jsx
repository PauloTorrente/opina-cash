import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { Container, Title, QuestionContainer, QuestionText, Select } from '../components/Survey.styles';
import AuthContext from '../context/AuthContext';
import styled, { keyframes } from 'styled-components';

// Animation for modal
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled components for success modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h2`
  color: #6c63ff;
  margin-bottom: 1rem;
`;

const ModalText = styled.p`
  margin-bottom: 2rem;
  color: #555;
`;

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
      setError(`Error: ${error.message}`);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  if (!user) return null; 

  if (loading) return <Container>Cargando...</Container>;
  if (error) return <Container>Error: {error}</Container>;
  if (!survey) return <Container>Encuesta no encontrada</Container>;

  return (
    <>
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

      {/* Success Modal */}
      {showSuccessModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>¡Encuesta completada!</ModalTitle>
            <ModalText>
              Gracias por participar. Tus respuestas han sido registradas con éxito.
            </ModalText>
            <Button onClick={handleModalClose}>Volver al inicio</Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default Survey;
