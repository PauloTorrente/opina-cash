import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateSurveyForm from '../components/CreateSurveyForm';
import SurveyCreatedSuccess from '../components/SurveyCreatedSuccess';
import AuthContext from '../context/AuthContext';

const CreateSurvey = () => {
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
      alert('Error al crear encuesta. Por favor, intente de nuevo.');
    }
  };

  return (
    <div>
      {createdSurvey ? (
        <SurveyCreatedSuccess survey={createdSurvey} accessToken={createdSurvey.accessToken} />
      ) : (
        <>
          <h1>Crear Encuesta</h1>
          <CreateSurveyForm onSubmit={handleSubmit} />
        </>
      )}
    </div>
  );
};

export default CreateSurvey;
