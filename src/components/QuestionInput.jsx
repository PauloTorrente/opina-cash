import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion'; // Importing Framer Motion for animations
import OptionInput from './OptionInput'; // Importing OptionInput component for multiple choice options

// Styled component for the select dropdown to choose question type
const Select = styled.select`
  width: 100%;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1.1rem;
`;

// Styled button for adding new options, with animation from framer-motion
const AddOptionButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: #007bff; // Blue button color
  border: none;
  color: #fff; // White text color
  font-size: 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1.5rem;
  &:hover {
    background-color: #0056b3; // Darker blue on hover
  }
`;

// Styled input field for entering the question text
const QuestionTextInput = styled.input`
  width: 100%;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1.2rem;
  &:focus {
    border-color: #28a745; // Green border on focus
    outline: none;
    box-shadow: 0 0 10px rgba(40, 167, 69, 0.5); // Green glow on focus
  }
`;

// The QuestionInput component to handle both question and options inputs
const QuestionInput = ({ index, question, onQuestionChange }) => {
  // Handle change in question type (multiple choice or text)
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    onQuestionChange(index, { type: newType, question: question.question, options: question.options });
  };

  // Handle text change for the question itself
  const handleQuestionTextChange = (e) => {
    const updatedQuestion = { question: e.target.value };
    onQuestionChange(index, updatedQuestion);
  };

  // Handle change in options for multiple choice question
  const handleOptionChange = (optionIndex, updatedOption) => {
    const updatedOptions = [...question.options];
    updatedOptions[optionIndex] = updatedOption;
    onQuestionChange(index, { type: question.type, question: question.question, options: updatedOptions });
  };

  // Add a new empty option to the multiple choice question
  const handleAddOption = () => {
    const updatedOptions = [...question.options, '']; // Adding a new empty option
    onQuestionChange(index, { type: question.type, question: question.question, options: updatedOptions });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} // Start with zero opacity for fade-in animation
      animate={{ opacity: 1 }} // Animate to full opacity
      exit={{ opacity: 0 }} // Fade-out animation
      transition={{ duration: 0.3 }} // Duration for fade-in/out
    >
      {/* Dropdown for selecting question type */}
      <Select value={question.type} onChange={handleTypeChange}>
        <option value="multiple_choice">Opción múltiple 🎮</option>
        <option value="text">Texto 💬</option>
      </Select>

      {/* Input for the question text */}
      <QuestionTextInput
        type="text"
        placeholder={`Pregunta ${index + 1}`}
        value={question.question || ''} // Display question text if it exists
        onChange={handleQuestionTextChange} // Update the question text
        required
      />

      {/* Render options only if question type is multiple_choice */}
      {question.type === 'multiple_choice' && (
        <div>
          {question.options.map((option, oIndex) => (
            <OptionInput
              key={oIndex} // Unique key for each option
              questionIndex={index} // Pass the index to identify the question
              optionIndex={oIndex} // Pass option index to identify the option
              option={option} // Pass the current option text
              onOptionChange={handleOptionChange} // Function to update option text
            />
          ))}
          {/* Button to add new option */}
          <AddOptionButton
            type="button"
            onClick={handleAddOption} // Add new empty option on click
            whileHover={{ scale: 1.1 }} // Slightly scale the button on hover
            whileTap={{ scale: 0.9 }} // Slightly shrink the button on tap
          >
            Añadir Opción ➕
          </AddOptionButton>
        </div>
      )}
    </motion.div>
  );
};

export default QuestionInput;
