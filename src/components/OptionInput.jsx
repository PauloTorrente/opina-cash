import React from 'react';
import styled from 'styled-components';

const OptionInputField = styled.input`
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

const OptionInput = ({ questionIndex, optionIndex, option, onOptionChange }) => {
  const handleOptionChange = (e) => {
    const updatedOption = e.target.value;
    onOptionChange(optionIndex, updatedOption); // Atualizando a opção
  };

  return (
    <OptionInputField
      type="text"
      placeholder={`Opción ${optionIndex + 1}`}
      value={option}
      onChange={handleOptionChange}
      required
    />
  );
};

export default OptionInput;
