import React from 'react';
import {
  WarningBox, WarningTitle, WarningText,
  TermsRow, TermsCheckbox, TermsLabel
} from '../../components/survey/Survey.styles.jsx';
import { useTranslation } from '../../i18n/LanguageContext';

const SurveyWarning = ({ checked, onChange }) => {
  const { t } = useTranslation();
  return (
    <WarningBox>
      <WarningTitle>
        <span>⚠️</span>
        {t('surveyWarning.title')}
      </WarningTitle>
      <WarningText>
        {t('surveyWarning.text')}
      </WarningText>
      <TermsRow $checked={checked}>
        <TermsCheckbox
          id="survey-terms"
          checked={checked}
          onChange={onChange}
          required
        />
        <TermsLabel htmlFor="survey-terms">
          {t('surveyWarning.termsLabel')}
        </TermsLabel>
      </TermsRow>
    </WarningBox>
  );
};

export default SurveyWarning;
