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

  // Process Imgur URL to standard format
  const processImgurUrl = (url) => {
    if (!url) return null;
    if (url.includes('i.imgur.com')) return url;
    const imageId = url.split('/').pop().split('.')[0];
    return `https://i.imgur.com/${imageId}.jpg`;
  };

  // Convert YouTube URL to embed format
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

        // Get authentication token
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token not found');

        // Fetch survey data from API
        const response = await fetch(`https://enova-backend.onrender.com/api/surveys/respond?accessToken=${accessToken}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error fetching survey');
        
        const surveyData = await response.json();
        if (!surveyData) throw new Error('Survey not found');

        // Parse questions (handle both string and object formats)
        let questions = typeof surveyData.questions === 'string' 
          ? JSON.parse(surveyData.questions) 
          : surveyData.questions;

        // Normalize question structure
        questions = questions.map((q, index) => {
          // Handle simple string questions
          if (typeof q === 'string') return {
            questionId: index + 1,
            question: q,
            type: 'text',
            answerLength: null
          };
          
          // Handle full question objects
          const questionId = q.id || q.questionId || index + 1;
          return {
            questionId,
            id: questionId,
            question: q.question || q.text,
            type: q.type || 'text',
            options: q.options || [],
            imagem: q.imagem ? processImgurUrl(q.imagem) : null,
            video: q.video ? processYoutubeUrl(q.video) : null,
            // CRITICAL FIX: Ensure answerLength is preserved
            answerLength: q.answerLength ? String(q.answerLength) : null
          };
        });

        // Create final survey object
        const fixedSurvey = { 
          ...surveyData, 
          questions
        };

        setSurvey(fixedSurvey);
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
