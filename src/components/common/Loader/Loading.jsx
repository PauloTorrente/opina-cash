import React from 'react';
import { keyframes , styled } from 'styled-components';
import { FaSpinner } from 'react-icons/fa';
import { useTranslation } from '../../../i18n/LanguageContext';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const Spinner = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
  font-size: 2rem;
  color: #3498db;
`;

function Loading({ message }) {
  const { t } = useTranslation();
  return (
    <LoadingContainer>
      <Spinner />
      <p>{message ?? t('common.loadingDefault')}</p>
    </LoadingContainer>
  );
}

export default Loading;
