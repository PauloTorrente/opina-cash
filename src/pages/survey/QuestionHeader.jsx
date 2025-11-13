import React from 'react';

// Component for rendering the question header with type indicator and required flag
const QuestionHeader = ({ questionType, question }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '15px',
      paddingBottom: '10px',
      borderBottom: '1px solid #e9ecef'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{
          color: questionType.color,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {questionType.icon}
        </span>
        <span style={{
          fontSize: '0.85rem',
          fontWeight: '600',
          color: questionType.color,
          backgroundColor: questionType.bgColor,
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          {questionType.label}
        </span>
      </div>

      {question.required && (
        <span style={{
          fontSize: '0.8rem',
          color: '#dc3545',
          fontWeight: '600'
        }}>
          * Requerido
        </span>
      )}
    </div>
  );
};

export default QuestionHeader;
