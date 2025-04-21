import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

export const Form = styled.form`
  width: 100%;
  max-width: 900px;
  background-color: #fff;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
`;

export const Input = styled.input`
  width: 100%;
  padding: 1.5rem;
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

export const Button = styled(motion.button)`
  padding: 1.5rem 3rem;
  background-color: #28a745;
  border: none;
  color: #fff;
  font-size: 1.3rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 2rem;
  &:hover {
    background-color: #218838;
  }
`;

export const SectionTitle = styled.h3`
  color: #333;
  font-size: 1.6rem;
  margin-bottom: 2rem;
  text-align: center;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

export const ActionButton = styled(motion.button)`
  padding: 1rem 2rem;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  flex: 1;
`;

export const AddButton = styled(ActionButton)`
  background-color: #007bff;
  &:hover {
    background-color: #0056b3;
  }
`;

export const RemoveButton = styled(ActionButton)`
  background-color: #dc3545;
  display: flex; // Adicionar esta linha
  align-items: center; // Garantir alinhamento
  gap: 0.5rem; // Espaço entre ícone e texto

  &:hover {
    background-color: #c82333;
  }
`;

export const MediaToggle = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const ToggleButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: ${props => props.$active ? '#6c63ff' : '#f1f1f1'};
  color: ${props => props.$active ? 'white' : '#333'};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const QuestionContainer = styled.div`
  position: relative;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 8px;
  background: #f8f9fa;
`;

export const RemoveQuestionButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
`;

export const OptionContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
`;

export const RemoveOptionButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  flex-shrink: 0;
`;

export const AddOptionButton = styled(motion.button)`
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    background: #0056b3;
  }
`;