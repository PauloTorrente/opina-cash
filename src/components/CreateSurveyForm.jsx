import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion'; 
import QuestionInput from './QuestionInput';

// Container for the form with flexbox for center alignment
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

// Main form styling with added padding and max-width
const Form = styled.form`
  width: 100%;
  max-width: 900px; /* Increasing max-width for a larger form */
  background-color: #fff;
  border-radius: 12px;
  padding: 3rem; /* Increased padding for spacing */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
`;

// Input styling for form fields
const Input = styled.input`
  width: 100%;
  padding: 1.5rem; /* Increased padding for better spacing */
  margin-bottom: 1.5rem; /* Added margin to space inputs apart */
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1.2rem; /* Increased font size for readability */
  &:focus {
    border-color: #28a745; // Green border on focus
    outline: none;
    box-shadow: 0 0 10px rgba(40, 167, 69, 0.5); // Green glow effect on focus
  }
`;

// Styled submit button with hover effect
const Button = styled(motion.button)`
  padding: 1.5rem 3rem; /* Increased padding for the button */
  background-color: #28a745;
  border: none;
  color: #fff;
  font-size: 1.3rem; /* Larger font size for button */
  border-radius: 6px;
  cursor: pointer;
  margin-top: 2rem; /* Added margin on top to separate from inputs */
  &:hover {
    background-color: #218838; // Darker green when hovered
  }
`;

// Title styling for the section
const SectionTitle = styled.h3`
  color: #333;
  font-size: 1.6rem; /* Increased font size */
  margin-bottom: 2rem; /* Spacing below the title */
  text-align: center;
`;

// Add button styling for adding new questions
const AddButton = styled(motion.button)`
  padding: 1rem 2rem; /* Increased padding for the button */
  background-color: #007bff;
  border: none;
  color: #fff;
  font-size: 1.2rem; /* Larger font size */
  border-radius: 6px;
  cursor: pointer;
  margin-top: 2rem; /* Margin to space from other elements */
  &:hover {
    background-color: #0056b3; // Darker blue when hovered
  }
`;

// Main form component for creating a survey
const CreateSurveyForm = ({ onSubmit }) => {
  // State to hold survey data
  const [surveyData, setSurveyData] = useState({
    title: '',
    description: '',
    expirationTime: '',
    status: 'active',
    questions: [{ type: 'multiple_choice', question: '', options: ['', ''] }],
  });

  // Handles changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSurveyData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles changes to individual questions in the survey
  const handleQuestionChange = (index, updatedQuestion) => {
    const updatedQuestions = surveyData.questions.map((q, i) =>
      i === index ? { ...q, ...updatedQuestion } : q
    );
    setSurveyData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  // Adds a new question to the survey
  const handleAddQuestion = () => {
    setSurveyData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { type: 'multiple_choice', question: '', options: ['', ''] },
      ],
    }));
  };

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(surveyData); // Calls onSubmit with the current survey data
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0 }} // Start with the form hidden
        animate={{ opacity: 1 }} // Fade in the form
        exit={{ opacity: 0 }} // Fade out when exiting
        transition={{ duration: 0.5 }}
      >
        <Form onSubmit={handleSubmit}>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem' }}>
            Crear Encuesta 📝
          </h1>
          <Input
            type="text"
            name="title"
            placeholder="Título de la encuesta"
            value={surveyData.title}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="description"
            placeholder="Descripción de la encuesta"
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
            <QuestionInput
              key={index}
              index={index}
              question={question}
              onQuestionChange={handleQuestionChange}
            />
          ))}

          <AddButton
            type="button"
            onClick={handleAddQuestion}
            whileHover={{ scale: 1.1 }} // Slight scale effect on hover
            whileTap={{ scale: 0.9 }} // Scale down on click
          >
            Añadir Pregunta ➕
          </AddButton>

          <Button type="submit" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            Crear Encuesta
          </Button>
        </Form>
      </motion.div>
    </Container>
  );
};

export default CreateSurveyForm; // Exports the form component for use in other parts of the app
