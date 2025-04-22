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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
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
            onKeyDown={handleKeyDown}
            required
          />
          
          <Input
            type="text"
            name="description"
            placeholder="Descripción"
            value={surveyData.description}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
          />
          
          <Input
            type="datetime-local"
            name="expirationTime"
            value={surveyData.expirationTime}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
          />

          <SectionTitle>Preguntas</SectionTitle>

          {surveyData.questions.map((question, index) => (
            <QuestionContainer key={index}>
              {surveyData.questions.length > 1 && (
                <RemoveQuestionButton 
                  type="button"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  ×
                </RemoveQuestionButton>
              )}
              
              <QuestionInput
                index={index}
                question={question}
                onQuestionChange={handleQuestionChange}
                onKeyDown={handleKeyDown}
              />
              
              <MediaToggle>
                <ToggleButton
                  type="button"
                  $active={question.mediaType === 'image'}
                  onClick={() => handleQuestionChange(index, {
                    mediaType: question.mediaType === 'image' ? null : 'image',
                    mediaUrl: ''
                  })}
                >
                  {question.mediaType === 'image' ? '✔️ Imagen' : 'Añadir Imagen'}
                </ToggleButton>
                
                <ToggleButton
                  type="button"
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
                    onKeyDown={handleKeyDown}
                  />
                  <MediaPreview type={question.mediaType} url={question.mediaUrl} />
                </>
              )}
            </QuestionContainer>
          ))}

          <ButtonGroup>
            <AddButton
              type="button"
              onClick={handleAddQuestion}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Añadir Pregunta ➕
            </AddButton>
            
            {surveyData.questions.length > 1 && (
              <RemoveButton
                type="button"
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
