import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Container,
  Form,
  Input,
  Button,
  SectionTitle,
  ButtonGroup,
  AddButton,
  RemoveButton,
  MediaToggle,
  ToggleButton,
  QuestionContainer,
  RemoveQuestionButton
} from './CreateSurveyForm.styles';
import QuestionInput from './QuestionInput';
import MediaPreview from './MediaPreview';

const CreateSurveyForm = ({ onSubmit }) => {
  const [surveyData, setSurveyData] = useState({
    title: '',
    description: '',
    expirationTime: '',
    questions: [{
      type: 'multiple_choice',
      question: '',
      options: ['', ''],
      mediaType: null,
      mediaUrl: ''
    }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSurveyData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, updatedQuestion) => {
    const updatedQuestions = surveyData.questions.map((q, i) =>
      i === index ? { ...q, ...updatedQuestion } : q
    );
    setSurveyData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleAddQuestion = () => {
    setSurveyData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { 
          type: 'multiple_choice', 
          question: '', 
          options: ['', ''],
          mediaType: null,
          mediaUrl: ''
        }
      ]
    }));
  };

  const handleRemoveQuestion = (index) => {
    if (surveyData.questions.length <= 1) return;
    const updatedQuestions = surveyData.questions.filter((_, i) => i !== index);
    setSurveyData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(surveyData);
  };

  return (
    <Container>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Form onSubmit={handleSubmit}>
          <h1>Crear Encuesta 📝</h1>
          
          <Input
            type="text"
            name="title"
            placeholder="Título"
            value={surveyData.title}
            onChange={handleChange}
            required
          />
          
          <Input
            type="text"
            name="description"
            placeholder="Descripción"
            value={surveyData.description}
            onChange={handleChange}
            required
          />
          
          <Input
            type="datetime-local"
            name="expirationTime"
            value={surveyData.expirationTime}
            onChange={handleChange}
            required
          />

          <SectionTitle>Preguntas</SectionTitle>

          {surveyData.questions.map((question, index) => (
            <QuestionContainer key={index}>
              {surveyData.questions.length > 1 && (
                <RemoveQuestionButton 
                  onClick={() => handleRemoveQuestion(index)}
                >
                  ×
                </RemoveQuestionButton>
              )}
              
              <QuestionInput
                index={index}
                question={question}
                onQuestionChange={handleQuestionChange}
              />
              
              <MediaToggle>
                <ToggleButton
                  $active={question.mediaType === 'image'}
                  onClick={() => handleQuestionChange(index, {
                    mediaType: question.mediaType === 'image' ? null : 'image',
                    mediaUrl: ''
                  })}
                >
                  {question.mediaType === 'image' ? '✔️ Imagen' : 'Añadir Imagen'}
                </ToggleButton>
                
                <ToggleButton
                  $active={question.mediaType === 'video'}
                  onClick={() => handleQuestionChange(index, {
                    mediaType: question.mediaType === 'video' ? null : 'video',
                    mediaUrl: ''
                  })}
                >
                  {question.mediaType === 'video' ? '✔️ Video' : 'Añadir Video'}
                </ToggleButton>
              </MediaToggle>

              {question.mediaType && (
                <>
                  <Input
                    type="text"
                    placeholder={`URL de ${question.mediaType === 'image' ? 'Imagen' : 'Video'}`}
                    value={question.mediaUrl}
                    onChange={(e) => handleQuestionChange(index, { mediaUrl: e.target.value })}
                  />
                  <MediaPreview type={question.mediaType} url={question.mediaUrl} />
                </>
              )}
            </QuestionContainer>
          ))}

          <ButtonGroup>
            <AddButton
              onClick={handleAddQuestion}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Añadir Pregunta ➕
            </AddButton>
            
            {surveyData.questions.length > 1 && (
              <RemoveButton
                onClick={() => handleRemoveQuestion(surveyData.questions.length - 1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Eliminar Última ➖
              </RemoveButton>
            )}
          </ButtonGroup>

          <Button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Crear Encuesta
          </Button>
        </Form>
      </motion.div>
    </Container>
  );
};

export default CreateSurveyForm;
