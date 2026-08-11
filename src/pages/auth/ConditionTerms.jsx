import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/LanguageContext';

const TermsContainer = styled.div`
  width: 90%;
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: #fff5f8;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #9b5de5;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

const TermsContent = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;
  margin-bottom: 1.5rem;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c9c4e4;
    border-radius: 10px;
  }
`;

const TermsText = styled.p`
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.6;
  text-align: justify;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const Highlight = styled.span`
  background-color: #f0e6ff;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 500;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 0.9rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const AcceptButton = styled(Button)`
  background-color: #6c63ff;
  color: white;

  &:hover {
    background-color: #5a52e0;
  }
`;

const DeclineButton = styled(Button)`
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;

  &:hover {
    background-color: #eaeaea;
  }
`;

const ConditionTerms = () => {
  const { t } = useTranslation();
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  const handleAccept = () => {
    setAccepted(true);
    navigate('/register');
  };

  const handleDecline = () => {
    alert(t('terms.declineAlert'));
  };

  return (
    <TermsContainer>
      <Title>{t('terms.title')}</Title>

      <TermsContent>
        <TermsText>
          <strong>{t('terms.agreementLabel')}</strong> {t('terms.intro')}
          <br /><br />

          <strong>{t('terms.section1.heading')}</strong>
          <br />
          {t('terms.section1.p1')}
          <br />
          {t('terms.section1.p2')}
          <br /><br />

          <strong>{t('terms.section2.heading')}</strong>
          <br />
          {t('terms.section2.p1')}
          <br />
          {t('terms.section2.p2')}
          <br /><br />

          <strong>{t('terms.section3.heading')}</strong>
          <br />
          {t('terms.section3.p1')}
          <br />
          {t('terms.section3.p2Before')}<Highlight>{t('terms.section3.p2Highlight1')}</Highlight>{t('terms.section3.p2Middle')}<Highlight>{t('terms.section3.p2Highlight2')}</Highlight>{t('terms.section3.p2After')}
        </TermsText>
      </TermsContent>

      <ButtonContainer>
        <DeclineButton onClick={handleDecline}>
          {t('terms.decline')}
        </DeclineButton>
        <AcceptButton onClick={handleAccept}>
          {t('terms.accept')}
        </AcceptButton>
      </ButtonContainer>
    </TermsContainer>
  );
};

export default ConditionTerms;
