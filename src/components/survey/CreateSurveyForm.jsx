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
import { useTranslation } from '../../i18n/LanguageContext';

const CreateSurveyForm = ({ onSubmit }) => {
  const { t } = useTranslation();
  const characterLimits = [
    { value: 'short', label: t('createSurveyForm.charLimitShort') },
    { value: 'medium', label: t('createSurveyForm.charLimitMedium') },
    { value: 'long', label: t('createSurveyForm.charLimitLong') },
    { value: 'unrestricted', label: t('createSurveyForm.charLimitUnrestricted') },
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
      validationErrors.push(t('createSurveyForm.validation.titleRequired'));
    }

    if (!surveyData.expirationTime) {
      validationErrors.push(t('createSurveyForm.validation.expirationRequired'));
    }

    surveyData.questions.forEach((q, i) => {
      if (!q.question.trim()) {
        validationErrors.push(t('createSurveyForm.validation.questionEmpty', { number: i + 1 }));
      }

      if (q.type === 'multiple_choice') {
        q.options.forEach((opt, optIndex) => {
          if (!opt.trim()) {
            validationErrors.push(t('createSurveyForm.validation.optionEmpty', { optionNumber: optIndex + 1, questionNumber: i + 1 }));
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
        // Backend/response UI expect 'multiple', not the 'multiple_choice'
        // value used internally by the question-type <select>.
        type: q.type === 'multiple_choice' ? 'multiple' : q.type,
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
          <h1>{t('createSurveyForm.heading')}</h1>

          <Input
            type="text"
            name="title"
            placeholder={t('createSurveyForm.titlePlaceholder')}
            value={surveyData.title}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
          />

          <Input
            type="text"
            name="description"
            placeholder={t('createSurveyForm.descriptionPlaceholder')}
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

          <SectionTitle>{t('createSurveyForm.questionsSection')}</SectionTitle>

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
                  <CharacterLimitLabel>{t('createSurveyForm.charLimitLabel')}</CharacterLimitLabel>
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
                  {question.mediaType === 'image' ? t('createSurveyForm.imageOn') : t('createSurveyForm.imageOff')}
                </ToggleButton>

                <ToggleButton
                  type="button"
                  $active={question.mediaType === 'video'}
                  onClick={() => handleQuestionChange(index, {
                    mediaType: question.mediaType === 'video' ? null : 'video',
                    mediaUrl: ''
                  })}
                >
                  {question.mediaType === 'video' ? t('createSurveyForm.videoOn') : t('createSurveyForm.videoOff')}
                </ToggleButton>
              </MediaToggle>

              {question.mediaType && (
                <>
                  <Input
                    type="text"
                    placeholder={t('createSurveyForm.mediaUrlPlaceholder', { mediaType: question.mediaType === 'image' ? t('createSurveyForm.mediaTypeImage') : t('createSurveyForm.mediaTypeVideo') })}
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
              {t('createSurveyForm.addQuestion')}
            </AddButton>

            {surveyData.questions.length > 1 && (
              <RemoveButton
                type="button"
                onClick={() => handleRemoveQuestion(surveyData.questions.length - 1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('createSurveyForm.removeLast')}
              </RemoveButton>
            )}
          </ButtonGroup>

          <Button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {t('createSurveyForm.submit')}
          </Button>
        </Form>
      </motion.div>
    </Container>
  );
};

export default CreateSurveyForm;
