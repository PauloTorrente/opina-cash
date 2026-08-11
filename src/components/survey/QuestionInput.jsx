import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/LanguageContext';

const Container = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  position: relative;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const QuestionTypeSelect = styled.select`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const QuestionTextInput = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const OptionInputContainer = styled.div`
  position: relative;
  margin-bottom: 0.5rem;
`;

const OptionInputField = styled.input`
  width: 100%;
  padding: 1rem;
  padding-right: 2.5rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const RemoveOptionButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  
  &:hover {
    background: #c82333;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  color: #fff;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  flex: 1;
  transition: background-color 0.3s;
`;

const AddOptionButton = styled(ActionButton)`
  background-color: #007bff;
  
  &:hover {
    background-color: #0069d9;
  }
`;

const RemoveOptionButtonLarge = styled(ActionButton)`
  background-color: #dc3545;
  
  &:hover {
    background-color: #c82333;
  }
`;

const QuestionInput = ({ index, question, onQuestionChange, onKeyDown }) => {
  const { t } = useTranslation();
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    console.group(`🔄 Alteração de tipo na pergunta ${index}`);
    console.log('🆕 Novo tipo selecionado:', newType);
    console.log('📌 Estado atual:', JSON.parse(JSON.stringify(question)));
    
    const update = {
      type: newType,
      ...(newType === 'multiple_choice' ? { 
        answerLength: undefined,
        options: question.options || ['', '']
      } : {}),
      ...(newType === 'text' ? { 
        answerLength: question.answerLength || 'medium',
        options: undefined
      } : {})
    };

    console.log('📤 Enviando atualização completa:', update);
    onQuestionChange(index, update);
    console.groupEnd();
  };

  const handleQuestionTextChange = (e) => {
    console.log(`📝 Texto da pergunta ${index} alterado para:`, e.target.value);
    onQuestionChange(index, {
      question: e.target.value
    });
  };

  const handleOptionChange = (optionIndex, e) => {
    const newValue = e.target.value;
    console.log(`✏️ Opção ${optionIndex} da pergunta ${index} alterada para:`, newValue);
    
    const newOptions = [...question.options];
    newOptions[optionIndex] = newValue;
    
    onQuestionChange(index, {
      options: newOptions
    });
  };

  const addOption = () => {
    if (question.options && question.options.length >= 6) {
      console.warn('❌ Limite máximo de opções atingido');
      alert(t('questionInput.maxOptionsAlert'));
      return;
    }
    
    console.log(`➕ Adicionando nova opção à pergunta ${index}`);
    onQuestionChange(index, {
      options: [...(question.options || ['', '']), '']
    });
  };

  const removeOption = (optionIndex) => {
    if (question.options && question.options.length <= 2) {
      console.warn('❌ Mínimo de opções atingido');
      alert(t('questionInput.minOptionsAlert'));
      return;
    }
    
    console.log(`➖ Removendo opção ${optionIndex} da pergunta ${index}`);
    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    
    onQuestionChange(index, {
      options: newOptions
    });
  };

  console.log(`🔄 QuestionInput ${index} renderizado`, {
    type: question.type,
    question: question.question,
    options: question.options,
    answerLength: question.answerLength
  });

  return (
    <Container>
      <QuestionTypeSelect
        value={question.type}
        onChange={handleTypeChange}
        onKeyDown={onKeyDown}
      >
        <option value="multiple_choice">{t('questionInput.typeMultipleChoice')}</option>
        <option value="text">{t('questionInput.typeText')}</option>
      </QuestionTypeSelect>

      <QuestionTextInput
        type="text"
        placeholder={t('questionInput.questionPlaceholder', { number: index + 1 })}
        value={question.question}
        onChange={handleQuestionTextChange}
        onKeyDown={onKeyDown}
        required
      />

      {question.type === 'multiple_choice' && (
        <>
          {question.options?.map((option, optionIndex) => (
            <OptionInputContainer key={optionIndex}>
              <OptionInputField
                type="text"
                placeholder={t('questionInput.optionPlaceholder', { number: optionIndex + 1 })}
                value={option}
                onChange={(e) => handleOptionChange(optionIndex, e)}
                onKeyDown={onKeyDown}
                required
              />
              {question.options.length > 2 && (
                <RemoveOptionButton
                  type="button"
                  onClick={() => removeOption(optionIndex)}
                  title={t('questionInput.removeOptionTitle')}
                >
                  ×
                </RemoveOptionButton>
              )}
            </OptionInputContainer>
          ))}

          <ButtonGroup>
            <AddOptionButton
              type="button"
              onClick={addOption}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('questionInput.addOption')}
            </AddOptionButton>

            {question.options?.length > 2 && (
              <RemoveOptionButtonLarge
                type="button"
                onClick={() => removeOption(question.options.length - 1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('questionInput.removeLastOption')}
              </RemoveOptionButtonLarge>
            )}
          </ButtonGroup>
        </>
      )}
    </Container>
  );
};

export default QuestionInput;
