import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Correção: Certifique-se que todos os componentes estilizados estão definidos
const Container = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  position: relative;
`;

const QuestionTypeSelect = styled.select`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
`;

const QuestionTextInput = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
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
`;

const AddOptionButton = styled(ActionButton)`
  background-color: #007bff;
`;

const RemoveOptionButtonLarge = styled(ActionButton)`
  background-color: #dc3545;
`;

const QuestionInput = ({ index, question, onQuestionChange }) => {
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    const newOptions = newType === 'multiple_choice' ? ['', ''] : [];
    onQuestionChange(index, {
      ...question,
      type: newType,
      options: newOptions
    });
  };

  const handleQuestionChange = (e) => {
    onQuestionChange(index, {
      ...question,
      question: e.target.value
    });
  };

  const handleOptionChange = (optionIndex, e) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = e.target.value;
    onQuestionChange(index, {
      ...question,
      options: newOptions
    });
  };

  const addOption = () => {
    if (question.options.length >= 6) {
      alert('Máximo 6 opciones permitidas');
      return;
    }
    onQuestionChange(index, {
      ...question,
      options: [...question.options, '']
    });
  };

  const removeOption = (optionIndex) => {
    if (question.options.length <= 2) {
      alert('Cada pregunta debe tener al menos dos opciones');
      return;
    }
    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    onQuestionChange(index, {
      ...question,
      options: newOptions
    });
  };

  return (
    <Container>
      <QuestionTypeSelect
        value={question.type}
        onChange={handleTypeChange}
      >
        <option value="multiple_choice">Opción múltiple</option>
        <option value="text">Respuesta de texto</option>
      </QuestionTypeSelect>

      <QuestionTextInput
        type="text"
        placeholder={`Pregunta ${index + 1}`}
        value={question.question}
        onChange={handleQuestionChange}
        required
      />

      {question.type === 'multiple_choice' && (
        <>
          {question.options.map((option, optionIndex) => (
            <OptionInputContainer key={optionIndex}>
              <OptionInputField
                type="text"
                placeholder={`Opción ${optionIndex + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(optionIndex, e)}
                required
              />
              {question.options.length > 2 && (
                <RemoveOptionButton
                  type="button"
                  onClick={() => removeOption(optionIndex)}
                  title="Eliminar opción"
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
              Añadir Opción
            </AddOptionButton>
            
            {question.options.length > 2 && (
              <RemoveOptionButtonLarge
                type="button"
                onClick={() => removeOption(question.options.length - 1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Eliminar Última
              </RemoveOptionButtonLarge>
            )}
          </ButtonGroup>
        </>
      )}
    </Container>
  );
};

export default QuestionInput;
