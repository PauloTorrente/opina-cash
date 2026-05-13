import React from 'react';
import {
  WarningBox, WarningTitle, WarningText,
  TermsRow, TermsCheckbox, TermsLabel
} from '../../components/survey/Survey.styles.jsx';

const SurveyWarning = ({ checked, onChange }) => (
  <WarningBox>
    <WarningTitle>
      <span>⚠️</span>
      Importante
    </WarningTitle>
    <WarningText>
      Al enviar tus respuestas, aceptas que serán evaluadas para determinar tu puntuación.
      Respuestas completas y bien elaboradas aumentarán tus oportunidades de ganar más recompensas.
    </WarningText>
    <TermsRow $checked={checked}>
      <TermsCheckbox
        id="survey-terms"
        checked={checked}
        onChange={onChange}
        required
      />
      <TermsLabel htmlFor="survey-terms">
        Entiendo y acepto los términos
      </TermsLabel>
    </TermsRow>
  </WarningBox>
);

export default SurveyWarning;
