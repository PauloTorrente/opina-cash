import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export const useSurvey = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const queryParams = new URLSearchParams(location.search);
  const accessToken = queryParams.get('accessToken');

  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const processImgurUrl = (url) => {
    if (!url) return null;
    if (url.includes('i.imgur.com')) return url;
    const imageId = url.split('/').pop().split('.')[0];
    return `https://i.imgur.com/${imageId}.jpg`;
  };

  const processYoutubeUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        if (!user) return;

        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token de autenticação não encontrado');

        const response = await fetch(`https://enova-backend.onrender.com/api/surveys/respond?accessToken=${accessToken}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error al obtener la encuesta');
        
        const surveyData = await response.json();
        if (!surveyData) throw new Error('Encuesta no encontrada');

        let questions = typeof surveyData.questions === 'string' 
          ? JSON.parse(surveyData.questions) 
          : surveyData.questions;

        questions = questions.map((q, index) => {
          if (typeof q === 'string') return {
            questionId: index + 1,
            question: q,
            type: 'text'
          };
          
          const questionId = q.id || q.questionId || index + 1;
          return {
            questionId,
            id: questionId,
            question: q.question || q.text,
            type: q.type || 'text',
            options: q.options || [],
            imagem: q.imagem ? processImgurUrl(q.imagem) : null,
            video: q.video ? processYoutubeUrl(q.video) : null
          };
        });

        setSurvey({ ...surveyData, questions });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken && user) fetchSurvey();
  }, [accessToken, user]);

  return { survey, loading, error };
};
