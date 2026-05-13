import React from 'react';
import { QuestionHeaderRow, TypeBadge, RequiredBadge } from '../../components/survey/Survey.styles.jsx';

const QuestionHeader = ({ questionType, question }) => (
  <QuestionHeaderRow>
    <TypeBadge $color={questionType.color}>
      {questionType.icon}
      {questionType.label}
    </TypeBadge>
    {question.required && (
      <RequiredBadge>* Requerido</RequiredBadge>
    )}
  </QuestionHeaderRow>
);

export default QuestionHeader;
