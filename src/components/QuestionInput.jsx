import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion'; // Importando o Framer Motion
import OptionInput from './OptionInput';

const Select = styled.select`
  width: 100%;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1.1rem;
`;

const AddOptionButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1.5rem;
  &:hover {
    background-color: #0056b3;
  }
`;

const QuestionTextInput = styled.input`
  width: 100%;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1.2rem;
  &:focus {
    border-color: #28a745;
    outline: none;
    box-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
  }
`;

const QuestionInput = ({ index, question, onQuestionChange }) => {
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    onQuestionChange(index, { type: newType, question: question.question, options: question.options });
  };

  const handleQuestionTextChange = (e) => {
    const updatedQuestion = { question: e.target.value };
    onQuestionChange(index, updatedQuestion);
  };

  const handleOptionChange = (optionIndex, updatedOption) => {
    const updatedOptions = [...question.options];
    updatedOptions[optionIndex] = updatedOption;
    onQuestionChange(index, { type: question.type, question: question.question, options: updatedOptions });
  };

  const handleAddOption = () => {
    const updatedOptions = [...question.options, '']; // Adiciona uma nova opção vazia
    onQuestionChange(index, { type: question.type, question: question.question, options: updatedOptions });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Select value={question.type} onChange={handleTypeChange}>
        <option value="multiple_choice">Opción múltiple 🎮</option>
        <option value="text">Texto 💬</option>
      </Select>

      <QuestionTextInput
        type="text"
        placeholder={`Pregunta ${index + 1}`}
        value={question.question || ''}
        onChange={handleQuestionTextChange}
        required
      />

      {question.type === 'multiple_choice' && (
        <div>
          {question.options.map((option, oIndex) => (
            <OptionInput
              key={oIndex}
              questionIndex={index}
              optionIndex={oIndex}
              option={option}
              onOptionChange={handleOptionChange} // Passando a função para alterar a opção
            />
          ))}
          <AddOptionButton
            type="button"
            onClick={handleAddOption}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Añadir Opción ➕
          </AddOptionButton>
        </div>
      )}
    </motion.div>
  );
};

export default QuestionInput;
