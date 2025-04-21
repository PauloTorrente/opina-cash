import React from 'react';
import { ButtonGroup, AddButton, RemoveButton } from './CreateSurveyForm.styles';

const QuestionActions = ({ questionsCount, onAddQuestion, onRemoveQuestion }) => {
  return (
    <ButtonGroup>
      <AddButton
        type="button"
        onClick={onAddQuestion}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Añadir Pregunta ➕
      </AddButton>
      
      {questionsCount > 1 && (
        <RemoveButton
          type="button"
          onClick={onRemoveQuestion}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          data-testid="remove-last-button"
        >
          Eliminar Última ➖
        </RemoveButton>
      )}
    </ButtonGroup>
  );
};

export default QuestionActions;
