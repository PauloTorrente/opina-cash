import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateSurveyForm from '../../components/survey/CreateSurveyForm';
import SurveyCreatedSuccess from '../../components/survey/SurveyCreatedSuccess';
import AuthContext from '../../context/AuthContext';
import { useTranslation } from '../../i18n/LanguageContext';

const CreateSurvey = () => {
  const { t } = useTranslation();
  const { user, authFetch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [createdSurvey, setCreatedSurvey] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/'); // Redirecionar se não for admin
    }
  }, [user, navigate]);

  const handleSubmit = async (surveyData) => {
    try {
      const response = await authFetch('/surveys', {
        method: 'POST',
        data: surveyData,
      });
      setCreatedSurvey(response.data); // Armazena os dados da enquete criada (incluindo accessToken)
    } catch (error) {
      console.error('Error creando encuesta:', error);
      alert(t('createSurvey.submitError'));
    }
  };

  return (
    <div>
      {createdSurvey ? (
        <SurveyCreatedSuccess survey={createdSurvey} accessToken={createdSurvey.accessToken} />
      ) : (
        <>
          <h1>{t('createSurvey.title')}</h1>
          <CreateSurveyForm onSubmit={handleSubmit} />
        </>
      )}
    </div>
  );
};

export default CreateSurvey;
