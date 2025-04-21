import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Title, 
  QuestionContainer, 
  QuestionText, 
  Select, 
  MediaContainer,
  ResponsiveImage,
  ResponsiveVideo
} from '../components/Survey.styles';
import { useSurvey } from '../hooks/useSurveys';
import { SuccessModal } from '../components/SuccessSurvey';
import Button from '../components/Button';
import InputField from '../components/InputField';
import AuthContext from '../context/AuthContext';

const Survey = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { survey, loading, error } = useSurvey();
  const [responses, setResponses] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Get accessToken from URL
  const queryParams = new URLSearchParams(location.search);
  const accessToken = queryParams.get('accessToken');

  const handleResponseChange = (questionId, answer) => {
    setResponses(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!survey?.questions || !user) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token de autenticação não encontrado');

      const responseData = survey.questions
        .map(question => ({
          questionId: Number(question.questionId),
          answer: responses[question.questionId] || ''
        }))
        .filter(item => item.answer !== '');

      const response = await fetch(`https://enova-backend.onrender.com/api/surveys/respond?accessToken=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(responseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar respuestas');
      }
      
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert(error.message);
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
          {survey.questions.map((question) => (
            <QuestionContainer key={`q-${question.questionId}`}>
              <QuestionText>{question.question}</QuestionText>
              
              {question.imagem && (
                <MediaContainer>
                  <ResponsiveImage 
                    src={question.imagem} 
                    alt={`Imagen para: ${question.question}`}
                    loading="lazy"
                  />
                </MediaContainer>
              )}

              {question.video && (
                <MediaContainer>
                  <ResponsiveVideo>
                    <iframe
                      src={question.video}
                      title={`Video para: ${question.question}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      frameBorder="0"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </ResponsiveVideo>
                </MediaContainer>
              )}

              {question.type === 'text' ? (
                <InputField
                  type="text"
                  placeholder="Tu respuesta"
                  value={responses[question.questionId] || ''}
                  onChange={(e) => handleResponseChange(question.questionId, e.target.value)}
                  required
                />
              ) : (
                <Select
                  value={responses[question.questionId] || ''}
                  onChange={(e) => handleResponseChange(question.questionId, e.target.value)}
                  required
                >
                  <option value="" disabled>Selecciona una opción</option>
                  {question.options.map((option, i) => (
                    <option key={`opt-${i}`} value={option}>{option}</option>
                  ))}
                </Select>
              )}
            </QuestionContainer>
          ))}
          <Button type="submit">Enviar respuestas</Button>
        </form>
      </Container>

      {showSuccessModal && <SuccessModal onClose={handleModalClose} />}
    </>
  );
};

export default Survey;
