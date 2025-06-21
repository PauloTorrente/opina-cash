import React, { useState, useCallback } from 'react';
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
  RemoveQuestionButton,
  Select,
  CharacterLimitLabel
} from './CreateSurveyForm.styles';
import QuestionInput from './QuestionInput';
import MediaPreview from './MediaPreview';

const CreateSurveyForm = ({ onSubmit }) => {
  const characterLimits = [
    { value: 'short', label: 'Corto (1-100 caracteres)' },
    { value: 'medium', label: 'Mediano (10-300 caracteres)' },
    { value: 'long', label: 'Largo (50-1000 caracteres)' },
    { value: 'unrestricted', label: 'Sin límite' },
  ];

  const [surveyData, setSurveyData] = useState({
    title: '',
    description: '',
    expirationTime: '',
    questions: [{
      type: 'multiple_choice',
      question: '',
      options: ['', ''],
      mediaType: null,
      mediaUrl: '',
      answerLength: 'medium'
    }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSurveyData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = useCallback((index, updatedQuestion) => {
    if (typeof updatedQuestion !== 'object' || updatedQuestion === null) {
      console.error('Tipo de atualização inválido:', updatedQuestion);
      return;
    }

    setSurveyData(prev => {
      const updatedQuestions = prev.questions.map((q, i) => {
        if (i !== index) return q;
        
        const newQuestion = { ...q, ...updatedQuestion };
        
        // Garante estrutura consistente para cada tipo
        if (newQuestion.type === 'multiple_choice') {
          return {
            ...newQuestion,
            answerLength: undefined,
            options: newQuestion.options || ['', '']
          };
        }
        
        if (newQuestion.type === 'text') {
          return {
            ...newQuestion,
            options: undefined,
            answerLength: newQuestion.answerLength || 'medium'
          };
        }
        
        return newQuestion;
      });
      
      return { ...prev, questions: updatedQuestions };
    });
  }, []);

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
          mediaUrl: '',
          answerLength: 'medium'
        }
      ]
    }));
  };

  const handleRemoveQuestion = (index) => {
    if (surveyData.questions.length <= 1) return;
    setSurveyData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação melhorada
    const validationErrors = [];
    
    if (!surveyData.title.trim()) {
      validationErrors.push('El título es requerido');
    }
    
    if (!surveyData.expirationTime) {
      validationErrors.push('La fecha de expiración es requerida');
    }
    
    surveyData.questions.forEach((q, i) => {
      if (!q.question.trim()) {
        validationErrors.push(`La pregunta ${i + 1} no puede estar vacía`);
      }
      
      if (q.type === 'multiple_choice') {
        q.options.forEach((opt, optIndex) => {
          if (!opt.trim()) {
            validationErrors.push(`La opción ${optIndex + 1} en la pregunta ${i + 1} no puede estar vacía`);
          }
        });
      }
    });
    
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    const formattedData = {
      ...surveyData,
      questions: surveyData.questions.map((q, idx) => ({
        question: q.question,
        questionId: idx + 1,
        type: q.type,
        answerLength: q.type === 'text' ? q.answerLength : undefined,
        ...(q.type === 'multiple_choice' && { 
          options: q.options.filter(opt => opt.trim() !== '') 
        }),
        ...(q.mediaType === 'image' && { imagem: q.mediaUrl }),
        ...(q.mediaType === 'video' && { video: q.mediaUrl })
      }))
    };
    
    onSubmit(formattedData);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') e.preventDefault();
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
              
              {question.type === 'text' && (
                <div style={{ marginTop: '10px', width: '100%' }}>
                  <CharacterLimitLabel>Límite de caracteres:</CharacterLimitLabel>
                  <Select
                    value={question.answerLength}
                    onChange={(e) => handleQuestionChange(index, { 
                      answerLength: e.target.value 
                    })}
                  >
                    {characterLimits.map(limit => (
                      <option key={limit.value} value={limit.value}>
                        {limit.label}
                      </option>
                    ))}
                  </Select>
                </div>
              )}
              
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
