import React from 'react';
import {
  QuestionContainer,
  RemoveQuestionButton,
  MediaToggle,
  ToggleButton,
  Input
} from './CreateSurveyForm.styles';
import QuestionInput from './QuestionInput';
import MediaPreview from './MediaPreview';

const QuestionSection = ({ index, question, onQuestionChange, onRemoveQuestion, showRemove }) => {
  return (
    <QuestionContainer>
      {showRemove && (
        <RemoveQuestionButton 
          type="button"
          onClick={() => onRemoveQuestion(index)}
          title="Eliminar pregunta"
        >
          ×
        </RemoveQuestionButton>
      )}
      
      <QuestionInput
        index={index}
        question={question}
        onQuestionChange={onQuestionChange}
      />
      
      <MediaToggle>
        <ToggleButton
          type="button"
          $active={question.mediaType === 'image'}
          onClick={() => onQuestionChange(index, {
            mediaType: question.mediaType === 'image' ? null : 'image',
            mediaUrl: ''
          })}
        >
          {question.mediaType === 'image' ? '✔️ Imagen' : 'Añadir Imagen'}
        </ToggleButton>
        
        <ToggleButton
          type="button"
          $active={question.mediaType === 'video'}
          onClick={() => onQuestionChange(index, {
            mediaType: question.mediaType === 'video' ? null : 'video',
            mediaUrl: ''
          })}
        >
          {question.mediaType === 'video' ? '✔️ Video' : 'Añadir Video'}
        </ToggleButton>
      </MediaToggle>

      {question.mediaType && (
        <>
          <Input
            type="text"
            placeholder={`URL de ${question.mediaType === 'image' ? 'Imagen (Imgur)' : 'Video (YouTube)'}`}
            value={question.mediaUrl}
            onChange={(e) => onQuestionChange(index, { mediaUrl: e.target.value })}
          />
          
          <MediaPreview 
            type={question.mediaType} 
            url={question.mediaUrl} 
          />
        </>
      )}
    </QuestionContainer>
  );
};

export default QuestionSection;