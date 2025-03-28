import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion'; // Importando o Framer Motion
import QuestionInput from './QuestionInput';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Form = styled.form`
  width: 100%;
  max-width: 900px; /* Aumentando o max-width */
  background-color: #fff;
  border-radius: 12px;
  padding: 3rem; /* Aumentando o padding */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
`;

const Input = styled.input`
  width: 100%;
  padding: 1.5rem; /* Aumentando o padding */
  margin-bottom: 1.5rem; /* Aumentando o espaço entre inputs */
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1.2rem; /* Aumentando a fonte */
  &:focus {
    border-color: #28a745;
    outline: none;
    box-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
  }
`;

const Button = styled(motion.button)`
  padding: 1.5rem 3rem; /* Aumentando o padding */
  background-color: #28a745;
  border: none;
  color: #fff;
  font-size: 1.3rem; /* Aumentando a fonte */
  border-radius: 6px;
  cursor: pointer;
  margin-top: 2rem; /* Aumentando o espaço acima do botão */
  &:hover {
    background-color: #218838;
  }
`;

const SectionTitle = styled.h3`
  color: #333;
  font-size: 1.6rem; /* Aumentando a fonte */
  margin-bottom: 2rem; /* Aumentando o espaço abaixo do título */
  text-align: center;
`;

const AddButton = styled(motion.button)`
  padding: 1rem 2rem; /* Aumentando o padding */
  background-color: #007bff;
  border: none;
  color: #fff;
  font-size: 1.2rem; /* Aumentando a fonte */
  border-radius: 6px;
  cursor: pointer;
  margin-top: 2rem; /* Aumentando o espaço acima do botão */
  &:hover {
    background-color: #0056b3;
  }
`;

const CreateSurveyForm = ({ onSubmit }) => {
  const [surveyData, setSurveyData] = useState({
    title: '',
    description: '',
    expirationTime: '',
    status: 'active',
    questions: [{ type: 'multiple_choice', question: '', options: ['', ''] }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSurveyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, updatedQuestion) => {
    const updatedQuestions = surveyData.questions.map((q, i) =>
      i === index ? { ...q, ...updatedQuestion } : q
    );
    setSurveyData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleAddQuestion = () => {
    setSurveyData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { type: 'multiple_choice', question: '', options: ['', ''] },
      ],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(surveyData);
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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

export default CreateSurveyForm;
